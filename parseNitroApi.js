'use strict';

var fs = require('fs');
var crypto = require('crypto');
var stream = require('stream');

var ajv = require('ajv')();

var x2j = require('jgexml/xml2json');
var xsd = require('jgexml/xsd2json');

var api = require('./nitroApi/api.json');
var jsonSchema = require('./validation/jsonSchema.json');
var swaggerSchema = require('./validation/swagger2Schema.json');
var raw = require('./nitroApi/raw_swagger.json');
var xsdStr = fs.readFileSync('./nitroApi/nitro-schema.xsd','utf8');

var apijs = './nitroApi/api.js';
var api_fh = fs.openSync(apijs,'w');

var config = require('./config.json');
var host = config.nitro.host;

var cache = [];
var seen = [];
var swagger = {};
var params = [];

//__________________________________________________________________
String.prototype.toCamelCase = function camelize() {
	return this.toLowerCase().replace(/[-_ \/\.](.)/g, function(match, group1) {
		return group1.toUpperCase();
    });
}

//__________________________________________________________________
function toArray(item) {
	if (!(item instanceof Array)) {
		var newitem = [];
		if (item) {
			newitem.push(item);
		}
		return newitem;
	}
	else {
		return item;
	}
}

//__________________________________________________________________
function checkHref(href,name) {
	href = href.replace(/\+/g, "%20"); //correct for difference between Java?/Javascript encodings
	return (href.indexOf(encodeURIComponent(name))>=0);
}

//__________________________________________________________________
function checkReleaseStatus(status) {
	return ((status!='alpha') && (status!='deprecated'));
}

//__________________________________________________________________
function deprecationInfo(feed,name,deprecated_since) {
	var result = ' since ' + (deprecated_since ? deprecated_since : 'unknown');
	var d = feed.deprecations.deprecated;
	if (d) {
		for (var i=0;i<d.length;i++) {
			if ((d[i].name == name) && (d[i].replaced_by)) {
				result = result + ' -> ' + d[i].replaced_by;
			}
		}
	}
	return result;
}

//__________________________________________________________________
function prohibits(p) {
	var s = '';
	var m = toArray(p.mixin);
	for (var i in m) {
		s += '* Prohibits mixin '+m[i].name+'\n';
	}
	var f = toArray(p.filter);
	for (var i in f) {
		s += '* Prohibits filter '+f[i].name+'\n';
	}
	return s;
}

//__________________________________________________________________
function depend(p) {
	var s = '';
	var a = toArray(p);

	for (var i in a) {
		if (a[i].filter) {
			s += '* Dependency on filter '+a[i].filter+(a[i].value ? ' value: '+a[i].value : '')+'\n';
		}
		if (a[i].mixin) {
			s += '* Dependency on mixin '+a[i].mixin+'\n';
		}
	}
	return s;
}

//__________________________________________________________________
function exportSortDirection(feed,sort,sortDirection,sortDirectionName) {
	s = '/**\n';
	s += '* '+sort.title+'\n';
	if (sortDirection.href) {
		s += '* ' +sortDirection.href+'\n';
		if (!checkHref(sortDirection.href,sortDirection.value)) {
			console.log('! sort '+sortDirectionName+'('+sortDirection.value+') does not exist in');
			console.log('  '+sortDirection.href);
		}
	}
	if (sortDirection.is_default == 'true') {
		s += '* isDefault\n';
	}
	if (sortDirection.depends_on) {
		s += '* depends_on = '+sortDirection.depends_on+'\n';
	}
	if (sortDirection.prohibits) {
		s += prohibits(sortDirection.prohibits);
	}
	s += '*/\n';
	fs.appendFileSync(apijs, s+'const '+sortDirectionName+" = 'sort="+sort.name+'&'+sortDirection.name+'='+sortDirection.value+"';\n", 'utf8');
	cache.push(sortDirectionName+' : '+sortDirectionName+',\n');

	var param = {};
	for (var p in params) {
		if (params[p].name == 'sort_direction') {
			param = params[p];
		}
	}
	if (!param.name) {
		param.name = 'sort_direction';
		param.in = 'query';
		param.description = 'Sort direction';
		param.type = 'string';
		param.required = false;
		param.enum = [];
		params.push(param);
	}
	if (param.enum.indexOf(sortDirection.value)<0) {
		param.enum.push(sortDirection.value);
	}

	return s;
}

//__________________________________________________________________
function processSortDirection(feed,sort,sortDirection,sortDirectionName) {
	exportSortDirection(feed,sort,sortDirection,sortDirectionName);
}

//__________________________________________________________________
function exportSort(feed,sort,sortName) {
	var s = '/**\n';
	s += '* '+sort.title+'\n';
	s += '* note that this sort has no sort-direction\n';
	if (sort.href) {
		s += '* ' +sort.href+'\n';
		if (!checkHref(sort.href,sort.name)) {
			console.log('! sort '+sortName+'('+sort.name+') does not exist in');
			console.log('  '+sort.href);
		}
	}
	if (sort.depends_on) {
		s += '* depends_on = '+sort.depends_on+'\n';
	}
	if (sort.prohibits) {
		s += prohibits(sort.prohibits);
	}
	s += '*/\n';
	fs.appendFileSync(apijs, s+'const '+sortName+" = 'sort="+sort.name+"';\n", 'utf8');
	cache.push(sortName+' : '+sortName+',\n');
	return s;
}

//__________________________________________________________________
function swagSort(sort) {

	// TODO unstable sorts

	var param = {};
	for (var p in params) {
		if (params[p].name == 'sort') {
			param = params[p];
		}
	}
	if (!param.name) {
		param.name = 'sort';
		param.in = 'query';
		param.description = 'Sorts:\n';
		param.type = 'string';
		param.required = false;
		param.enum = [];
		params.push(param);
	}
	param.enum.push(sort.name);
	param.description += '* '+sort.title+'\n';
}

//__________________________________________________________________
function processSort(feed,sort,sortName) {
	if (checkReleaseStatus(sort.release_status)) {
		swagSort(sort);
		if (sort.sort_direction) {
			sort.sort_direction = toArray(sort.sort_direction);
			for (var i in sort.sort_direction) {
				var sortDirection = sort.sort_direction[i];
				var sortDirectionName = ('s-'+feed.name+'-'+sort.name+'-'+sortDirection.value).toCamelCase();
				if (seen.indexOf(sortDirectionName)<0) {
					processSortDirection(feed,sort,sortDirection,sortDirectionName);
					seen.push(sortDirectionName);
				}
				else {
					console.log('* Skipping sort '+sortDirectionName+' as duplicate name');
				}
			}
		}
		else {
			if (seen.indexOf(sortName)<0) {
				exportSort(feed,sort,sortName);
				seen.push(sortName);
			}
			else {
				console.log('* Skipping sort '+sortName+' as duplicate name');
			}
		}
	}
	else {
		console.log('Skipping sort '+sortName+' as '+sort.release_status+' '+deprecationInfo(feed,sort.name,sort.deprecated_since));
	}
}

//__________________________________________________________________
function exportMixin(feed,mixin,mixinName,stable) {
	var s = '/**\n';
	s += '* '+mixin.title+'\n';
	if (mixin.href) {
		s += '* '+mixin.href+'\n';
		if (!checkHref(mixin.href,mixin.name)) {
			console.log('! Mixin '+mixinName+'('+mixin.name+') does not appear in');
			console.log('  '+mixin.href);
		}
	}
	if (mixin.depends_on) {
		s += '* depends_on = '+mixin.depends_on+'\n';
	}
	if (mixin.prohibits) {
		s += prohibits(mixin.prohibits);
	}
	if (mixin.dependency_on) {
		s += depend(mixin.dependency_on);
	}
	if (mixin.affected_by) {
		if (mixin.affected_by.filter) {
			for (var i=0;i<mixin.affected_by.filter.length;i++) {
				s += '* is affected by filter '+mixin.affected_by.filter[i].name+' ('+mixin.affected_by.filter[i].description+')\n';
			}
		}
	}

	s += '*/\n';
	if (stable) {
		fs.appendFileSync(apijs, s+'const '+mixinName+" = 'mixin="+mixin.name+"';\n", 'utf8');
	}
	else {
		fs.appendFileSync(apijs, s+'const '+mixinName+" = 'unstable_mixin="+mixin.name+"&mixin="+mixin.name+"';\n", 'utf8');
	}
	cache.push(mixinName+' : '+mixinName+',\n');

	var param = {};
	for (var p in params) {
		if (params[p].name == 'mixin') {
			param = params[p];
		}
	}
	if (!param.name) {
		param.name = 'mixin';
		param.in = 'query';
		param.description = 'Mixins:\n';
		param.type = 'array';
		param.collectionFormat = 'multi';
		param.items = {};
		param.items.format = 'string';
		param.required = false;
		param.enum = [];
		params.push(param);
	}
	param.enum.push(mixin.name);
	param.description += '* '+mixin.title+'\n';

	if (!stable) {
		param = {};
		for (var p in params) {
			if (params[p].name == 'unstable_mixin') {
				param = params[p];
			}
		}
		if (!param.name) {
			param.name = 'unstable_mixin';
			param.in = 'query';
			param.description = 'Unstable mixins:\n';
			param.type = 'array';
			param.collectionFormat = 'multi';
			param.items = {};
			param.items.format = 'string';
			param.required = false;
			param.enum = [];
			params.push(param);
		}
		param.enum.push(mixin.name);
		param.description += '* '+mixin.title+'\n';
	}

	return s;
}

//__________________________________________________________________
function processMixin(feed,mixin,mixinName,stable) {
	if (checkReleaseStatus(mixin.release_status)) {
		if (seen.indexOf(mixinName)<0) {
			exportMixin(feed,mixin,mixinName,stable);
			seen.push(mixinName);
		}
		else {
			console.log('* Skipping mixin '+mixinName+' as duplicate name');
		}
	}
	else {
		console.log('Skipping mixin '+mixinName+' as '+mixin.release_status+deprecationInfo(feed,mixin.name,mixin.deprecated_since));
	}
}

//__________________________________________________________________
function exportFilter(feed,filter,filterName) {

	var optionCount = 0;

	var s = '/**\n';
	s += '* '+filter.title+'\n';
	if (filter.href) {
		if (!checkHref(filter.href,filter.name)) {
			console.log('! filter '+filterName+'('+filter.name+') does not appear in');
			console.log('  '+filter.href);
		}
		s += '* '+filter.href+'\n';
	}
	if (filter.type) {
		s += '* type = '+filter.type+'\n';
	}
	if (filter.default) {
		s += '* default = '+filter.default+'\n';
	}
	if (filter.min_value) {
		s += '* min_value = '+filter.min_value+'\n';
	}
	if (filter.max_value) {
		s += '* max_value = '+filter.max_value+'\n';
	}
	if (filter.depends_on) {
		s += '* depends_on = '+filter.depends_on+'\n';
	}
	if (filter.prefer) {
		s += '* prefer = '+filter.prefer+'\n';
	}
	if (filter.prohibits) {
		s += prohibits(filter.prohibits);
	}
	if (filter.affected_by) {
		if (filter.affected_by.filter) {
			for (var i=0;i<filter.affected_by.filter.length;i++) {
				s += '* is affected by filter '+filter.affected_by.filter[i].name+' ('+filter.affected_by.filter[i].description+')\n';
			}
		}
	}

	if (filter.option) {
		filter.option = toArray(filter.option);
		for (var i in filter.option) {
			var option = filter.option[i];
			if (option.title) {
				s += '* option: '+option.value+', '+option.title+'\n';
				s += '*/\n';
				var optionName = filterName+('-'+option.value).toCamelCase();
				cache.push(optionName+' : '+optionName +',\n');
				fs.appendFileSync(apijs, s+'const '+optionName+" = '"+filter.name+'='+encodeURIComponent(option.value)+"';\n", 'utf8');
				s = '/**\n';
				seen.push(optionName);
				//optionCount++;
			}
			if (option.href) {
				s += '* '+option.href+'\n';
				if (!checkHref(option.href,option.value)) {
					console.log('! option '+filterName+'('+option.value+') does not exist in');
					console.log('  '+option.href);
				}
			}

			var param = {};
			for (var p in params) {
				if (params[p].name == filter.name) {
					param = params[p];
				}
			}
			if (!param.name) {
				param.name = filter.name;
				param.in = 'query';
				param.description = filter.title;
				param.type = 'array';
				param.collectionFormat = 'multi';
				param.items = {};
				param.items.format = 'string';
				param.required = false;
				param.enum = [];
				params.push(param);
			}
			param.enum.push(option.value);

			// TODO unstable filters

		}
	}
	s += '*/\n';
	fs.appendFileSync(apijs, s+'const '+filterName+" = '"+filter.name+"';\n", 'utf8');
	cache.push(filterName + ' : '+filterName +',\n');

	if (optionCount<1) {
		var param = {};
		for (var p in params) {
			if (params[p].name == filter.name) {
				param = params[p];
			}
		}
		if (!param.name) {
			param.name = filter.name;
			param.in = 'query';
			param.description = filter.title;
			param.type = filter.type;
			if (filter.type == 'PID') {
				param.type = 'string';
				param.minLength = 8;
				param.pattern = "^([0-9,a-d,f-h,j-n,p-t,v-z]){8,}$";
			}
			if (filter.type == 'ID') {
				param.type = 'string';
			}
			if (filter.type == 'datetime') {
				param.type = 'string';
				param.format = 'date-time';
			}
			if (filter.type == 'date') {
				param.type = 'string';
				param.format = 'date';
			}
			if (filter.type == 'character') {
				param.type = 'string';
				param.minLength = 1;
				param.maxLength = 1;
			}
			if (filter.default) {
				param.default = filter.default;
				if (param.type == 'integer') {
					param.default = parseInt(filter.default,10);
				}
			}
			if (filter.min_value) {
				param.minimum = filter.min_value;
			}
			if (filter.max_value) {
				param.maximum = filter.max_value;
			}
			if (filter.multiple_values === true) {
				param.items = {};
				param.items.type = param.type;
				param.type = 'array';
				param.collectionFormat = 'multi';
				if (param.pattern) {
					param.items.pattern = param.pattern;
					delete param.pattern;
				}
				if (param.minLength) {
					param.items.minLength = param.minLength;
					delete param.minLength;
				}
				if (param.maxLength) {
					param.items.maxLength = param.maxLength;
					delete param.maxLength;
				}
			}
			param.required = false;
			params.push(param);
		}
	}

	return optionCount;
}

//__________________________________________________________________
function processFilter(feed,filter,filterName) {
	if (checkReleaseStatus(filter.release_status)) {
		if (seen.indexOf(filterName)<0) {
			if (!filter.type) {
				console.log('+ typeless filter: '+filterName);
			}
			if (exportFilter(feed,filter,filterName)==0) {
				seen.push(filterName);
			}
		}
		else {
			console.log('* Skipping filter '+filterName+' as duplicate name');
		}
	}
	else {
		console.log('Skipping filter '+filterName+' as '+filter.release_status+deprecationInfo(feed,filter.name,filter.deprecated_since));
	}
}

//__________________________________________________________________
function additionalParameters(feedName) {
	if (feedName == 'Availability') {
		fs.appendFileSync(apijs, 'const x'+feedName+"DebugTrue = 'debug=true';\n", 'utf8');
		fs.appendFileSync(apijs, 'const x'+feedName+"Debug = 'debug';\n", 'utf8');
		var s = 'x'+feedName+'DebugTrue : x'+feedName+'DebugTrue,\n';
		s += 'x'+feedName+'Debug : x'+feedName+'Debug,\n';
		cache.push(s);
	}
}

//__________________________________________________________________
function processFeed(feed) {

	var feedName = ('nitro-'+feed.name).toCamelCase();
	var s = '/**\n';
	s += '* '+feed.title+'\n';
	s += '*/\n';
	fs.appendFileSync(apijs, s+'const '+feedName+" = '"+feed.href+"';\n", 'utf8');
	cache.push(feedName+' : '+feedName+',\n');

	var pathname = feed.href.replace('/nitro/api','');
	var path = swagger.paths[pathname] = {};
	path.get = {};
	path.get.description = feed.title;
	path.get.tags = ['feeds'];
	path.get.summary = feed.title;

	// a long time ago, in a galaxy far, far away, the API had longer descriptions. Some taken from https://developer.bbc.co.uk/content/
	if (feed.name == 'Programmes') {
		path.get.description = 'Fetch metadata about Programmes (brands, series, episodes, clips). By applying different filter restrictions this feed can be used in many ways, for example to retrieve all series belonging to a brand, all the episodes and/or clips for a specific series, or any TLEO objects for a masterbrand. Other filters permit restricting to specific formats and/or genres, and you can request specific versions (for example Signed or Audio-Described). Parameters may be combined in any way suitable for your application.';
	}
	else if (feed.name == 'Broadcasts') {
		path.get.description = 'Fetch metadata about linear Broadcasts and Services, allowing the generation of Television and Radio schedules and other datasets for broadcast items. Use /schedules instead of this feed as it is more efficient. Broadcasts will be deprecated in the future.';
	}
	else if (feed.name == 'Schedules') {
		path.get.description = 'Dates, Times, Schedules: when and where are programmes being shown?';
	}
	else if (feed.name == 'Versions') {
		path.get.description = 'The versions feed exposes editorial "Versions" of programmes. These are concepts used to capture different presentations of an overall programme: for example, versions of a programme may include one with sign language, one with audio description, one edited for content and more. Versions are also important to understand for broadcasts: a linear broadcast or an ondemand is always of a specific version, not merely of a programme.';
	}
	else if (feed.name == 'Services') {
		path.get.description = 'The services feed exposes the linear broadcast "services" from PIPs. These are the actual services which broadcast programmes (eg bbc_one_oxford is the service for BBC One in Oxford).';
	}
	else if (feed.name == 'People') {
		path.get.description = 'The People feed allows you to search for the people and groups that contribute to programmes. This is the starting point for cast and crew credits, as well as finding contributors using external IDs (such as Wikipedia URLs)';
	}
	else if (feed.name == 'Availabilities') {
		path.get.description = 'For advanced users only: Use the availabilities feed to discover details of on-demand availability for programmes and their versions.';
	}
	else if (feed.name == 'Images') {
		path.get.description = 'Find metadata for images, particularly those in galleries';
	}
	else if (feed.name == 'Promotions') {
		path.get.description = 'Details of short-term editorially curated "promotions", for instance those programmes featured on iPlayer today';
	}
	else if (feed.name == 'Groups') {
		path.get.description = 'Long-lived curated collections of programmes and more, including Collections, Seasons, Franchises and Galleries';
	}

	path.get.operationId = 'list'+feed.name;
	params = path.get.parameters = [];

	path.get.responses = {};
	path.get.responses['200'] = {};
	path.get.responses['200'].description = 'Nitro response';
	path.get.responses['200'].schema = {};
	path.get.responses['200'].schema['$ref'] = '#/definitions/nitro';

	path.get.responses.default = {};
	path.get.responses.default.description = 'Unexpected error';
	path.get.responses.default.schema = {};
	path.get.responses.default.schema['$ref'] = '#/definitions/ErrorModel';

	if (feed.release_status == 'deprecated') {
		path.get.deprecated = true;
		console.log('! Warning, feed '+feed.name+' is '+feed.release_status+deprecationInfo(feed,feed.name,feed.deprecated_since))
	}

	if (feed.sorts) {
		feed.sorts.sort = toArray(feed.sorts.sort);
		if (feed.sorts.sort instanceof Array) {
			for (var i in feed.sorts.sort) {
				var sort = feed.sorts.sort[i];
				var sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
				processSort(feed,sort,sortName);
			}
		}
	}

	if (feed.mixins) {
		feed.mixins.mixin = toArray(feed.mixins.mixin);
		for (var i in feed.mixins.mixin) {
			var mixin = feed.mixins.mixin[i];
			var mixinName = ('m-'+feed.name+'-'+mixin.name).toCamelCase();
			processMixin(feed,mixin,mixinName,true);
		}
		if (feed.mixins.unstable_mixins) {
			feed.mixins.unstable_mixins.mixin = toArray(feed.mixins.unstable_mixins.mixin);
			for (var i in feed.mixins.unstable_mixins.mixin) {
				var mixin = feed.mixins.unstable_mixins.mixin[i];
				var mixinName = ('m-'+feed.name+'-'+mixin.name).toCamelCase();
				processMixin(feed,mixin,mixinName,false);
			}
		}
	}

	if (feed.filters) {
		feed.filters.filter = toArray(feed.filters.filter);
		for (var i in feed.filters.filter) {
			var filter = feed.filters.filter[i];
			var filterName = ('f-'+feed.name+'-'+filter.name).toCamelCase();
			processFilter(feed,filter,filterName);
		}
	}

	additionalParameters(feed.name);

}

//__________________________________________________________________
function initSwagger() {
	return JSON.parse(`{
	  "swagger": "2.0",
	  "info": {
		"version": "1.0.0",
		"title": "BBC Nitro API",
		"x-logo": {
			"url": "https://developer.bbc.co.uk/sites/default/files/Nitro%20On%20White.png"
		},
		"x-apiClientRegistration": {
			"url": "https://developer.bbc.co.uk/user/register"
		},
		"description": "BBC Nitro is the BBC's application programming interface (API) for BBC Programmes Metadata.",
		"termsOfService": "http://www.bbc.co.uk/terms/",
		"contact": {
		  "name": "Open Nitro Project",
		  "email": "nitro@bbc.co.uk",
		  "url": "http://developer.bbc.co.uk/"
		},
		"license": {
		  "name": "Nitro Public License",
		  "url": "https://developer.bbc.co.uk/nitropubliclicence/"
		}
	  },
	  "externalDocs": {
		"description": "Nitro for developers",
		"url": "https://developer.bbc.co.uk/nitro"
	  },
	  "host": "bbc.co.uk",
	  "basePath": "/nitro/api",
	  "tags" : [{
			"name" : "feeds",
			"description" : "Nitro data feeds"
		}, {
			"name" : "schema",
			"description" : "Nitro metadata"
		}
	  ],
	  "schemes": [
		"http",
		"https"
	  ],
	  "consumes": [
		"application/json"
	  ],
	  "produces": [
		"application/json",
		"application/xml"
	  ],
	  "paths": {
	  },
	  "definitions": {
		"ErrorModel": {
			"type": "object",
			"properties": {
				"fault": {
					"type": "object",
					"properties": {
						"faultString": {
							"type": "string"
						},
						"detail": {
							"type": "object",
							"properties": {
								"errorcode": {
									"type": "string"
								}
							}
						}
					}
				}
			}
		}
	  },
      "securityDefinitions" : {
		"api_key" : {
			"type" : "apiKey",
			"name" : "api_key",
			"in" : "query"
		}
	  },
	  "security": [{
		  "api_key" : []
	  }]
	}`);
}

	/*
	{ "fault": {
		"faultstring": "Rate limit quota violation. Quota limit : 0 exceeded by 1. Total violation count : 1. Identifier : YOUR-API-KEY-HERE",
		"detail":
			{"errorcode": “policies.ratelimit.QuotaViolation"}
		}
	}
	*/
	/*
	{"errors":{"error":{"code":"XDMP-EXTIME","message":"Time limit exceeded"}}}
	*/


//__________________________________________________________________
function definePath(desc,id) {
	var path = {};
	path.get = {};
	path.get.summary = path.get.description = desc;
	path.get.tags = ['schema'];
	path.get.operationId = id;
	params = path.get.parameters = [];

	path.get.responses = {};
	path.get.responses['200'] = {};
	path.get.responses['200'].description = 'Metadata response';
	path.get.responses.default = {};
	path.get.responses.default.description = 'Unexpected error';
	path.get.responses.default.schema = {};
	path.get.responses.default.schema['$ref'] = '#/definitions/ErrorModel';

	return path;
}

//__________________________________________________________________
function patchSwagger() {

	var debug = {};
	debug.name = 'debug';
	debug.in = 'query';
	debug.description = 'Turn on debug information (undocumented)';
	debug.type = 'boolean';
	debug.required = false;
	swagger.paths["/availabilities"].get.parameters.push(debug);
}

//__________________________________________________________________
function addRaw() {
	swagger.tags = swagger.tags.concat(raw.tags);
	for (var p in raw.paths) {
		swagger.paths[p] = raw.paths[p];
		swagger.paths[p].get.responses['200'].description = 'Nitro response';
		swagger.paths[p].get.responses['200'].schema = {};
		swagger.paths[p].get.responses['200'].schema['$ref'] = '#/definitions/nitro';
	}
}

function recurse(obj,parent,callback,depthFirst) {
	if (typeof obj != 'string') {
		for (var key in obj) {
			// skip loop if the property is from prototype
			if (!obj.hasOwnProperty(key)) continue;

			if (!depthFirst) callback(obj,parent,key);

			var array = Array.isArray(obj);

			if (typeof obj[key] === 'object') {
				if (array) {
					for (var i in obj[key]) {
						recurse(obj[key][i],obj[key],callback);
					}
				}
				recurse(obj[key],obj,callback);
			}

			if (depthFirst) callback(obj,parent,key);
		}
	}

	return obj;
}

//__________________________________________________________________
function processXsd() {
	console.log();
	console.log('Processing XML schema...');
	var src = x2j.xml2json(xsdStr,{"attributePrefix": "@","valueProperty": false, "coerceTypes": false});
	var obj = xsd.getJsonSchema(src,'nitro-schema','',true);

	console.log('Validating generated JSON schema...');
	var validate = ajv.compile(jsonSchema);
	validate(obj,{
		allErrors: true,
		verbose: true
	});
	var errors = validate.errors;
	if (errors) {
		console.log(errors);
		return false;
	}
	else {
		fs.writeFileSync('./nitroApi/nitro-schema.json',JSON.stringify(obj,null,2),'utf8');

		recurse(obj,{},function(obj,parent,key){
			if (key == 'anyOf') {
				obj["x-anyOf"] = obj["anyOf"];
				delete obj["anyOf"];
				if (obj.additionalProperties === false) {
					obj.additionalProperties = true;
				}
			}
		});

		var existing = swagger.definitions;
		var root = obj.properties;
		swagger.definitions = obj.definitions;
		swagger.definitions.nitro = root.nitro;
		swagger.definitions.nitro.additionalProperties = true; // cope with undefined 'items'
		swagger.definitions.ErrorModel = existing.ErrorModel;
		return true;
	}
}

//__________________________________________________________________

//https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md

var canonical = JSON.stringify(api);

var shasum = crypto.createHash('sha256');
var digest = '';

var s = new stream.Readable();
s._read = function noop() {};
s.push(canonical);
s.push(null);

s.on('data', function(d) {
  shasum.update(d);
});

s.on('end', function() {
  digest = shasum.digest('hex');
});

swagger = initSwagger();
swagger.host = host;

var feed;
for (var f in api.feeds.feed) {
	feed = api.feeds.feed[f];
	if (checkReleaseStatus(feed.release_status)) {
		processFeed(feed);
	}
	else {
		console.log('Skipping feed '+feed.name+' as '+feed.release_status+deprecationInfo(feed,feed.name,feed.deprecated_since));
	}
}

// these do not return the nitro object model
swagger.paths['/'] = definePath('Get API definition','getAPI');
swagger.paths['/schema'] = definePath('Get Schema definition','getXSD');

var jsonSchemaOk = processXsd();

patchSwagger();
addRaw();

process.on('exit',function(){
	fs.appendFileSync(apijs, "const apiHash = '" + digest + "';\n", 'utf8');
	fs.appendFileSync(apijs, '\nmodule.exports = {\n');
	for (var i in cache) {
		fs.appendFileSync(apijs, cache[i]);
	}

	fs.appendFileSync(apijs, 'apiHash : apiHash\n', 'utf8');
	fs.appendFileSync(apijs, '}\n', 'utf8');

	fs.closeSync(api_fh);

	if (jsonSchemaOk) {
		console.log('Validating swagger spec...');
		var validate = ajv.compile(swaggerSchema);
		validate(swagger,{
			allErrors: true,
			verbose: true
		});
		var errors = validate.errors;
		if (errors) {
			console.log(errors);
		}
		else {
			console.log('Writing swagger spec');
			var swaggerStr = JSON.stringify(swagger,null,'\t');
			fs.writeFileSync('./nitroApi/swagger.json',swaggerStr);
		}
	}
	else {
		console.log('Error processing XSD');
	}
});
