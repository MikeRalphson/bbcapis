'use strict';

var fs = require('fs');
var crypto = require('crypto');
var stream = require('stream');

var apistr = fs.readFileSync('./nitroApi/api.json', 'utf8');
var api = JSON.parse(apistr);

var apijs = './nitroApi/api.js';
var api_fh = fs.openSync(apijs,'w');

var cache = [];
var seen = [];
var swagger = {};
var params = [];

//__________________________________________________________________

String.prototype.toCamelCase = function camelize() {
	return this.toLowerCase().replace(/[-_ ](.)/g, function(match, group1) {
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
	if (sortDirection.is_default) {
		s += '* isDefault\n';
	}
	if (sortDirection.depends_on) {
		s += '* depends_on = '+sortDirection.depends_on+'\n';
	}
	if (sortDirection.prohibits) {
		s += prohibits(sortDirection.prohibits);
	}
	s += '*/\n';
	s += sortDirectionName+' : '+sortDirectionName+',\n';
	fs.appendFileSync(apijs, 'const '+sortDirectionName+" = 'sort="+sort.name+'&'+sortDirection.name+'='+sortDirection.value+"';\n", 'utf8');
	cache.push(s);

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
	s += sortName+' : '+sortName+',\n';
	fs.appendFileSync(apijs, 'const '+sortName+" = 'sort="+sort.name+"';\n", 'utf8');
	cache.push(s);
	return s;
}

//__________________________________________________________________
function swagSort(sort) {
	var param = {};
	for (var p in params) {
		if (params[p].name == 'sort') {
			param = params[p];
		}
	}
	if (!param.name) {
		param.name = 'sort';
		param.in = 'query';
		param.description = 'Sort';
		param.type = 'string';
		param.required = false;
		param.enum = [];
		params.push(param);
	}
	param.enum.push(sort.name);
}

//__________________________________________________________________
function processSort(feed,sort,sortName) {
	if (checkReleaseStatus(sort.release_status)) {
		swagSort(sort);
		if (sort.sort_direction) {
			sort.sort_direction = toArray(sort.sort_direction); // only necessary if json api converted from xml
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
		console.log('Skipping sort '+sortName+' as '+sort.release_status);
	}
}

//__________________________________________________________________
function exportMixin(feed,mixin,mixinName) {
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
	s += '*/\n';
	s += mixinName+' : '+mixinName+',\n';
	fs.appendFileSync(apijs, 'const '+mixinName+" = 'mixin="+mixin.name+"';\n", 'utf8');
	cache.push(s);

	var param = {};
	for (var p in params) {
		if (params[p].name == 'mixin') {
			param = params[p];
		}
	}
	if (!param.name) {
		param.name = 'mixin';
		param.in = 'query';
		param.description = 'Mixin';
		param.type = 'array';
		param.collectionFormat = 'multi';
		param.items = {};
		param.items.format = 'string';
		param.required = false;
		param.enum = [];
		params.push(param);
	}
	param.enum.push(mixin.name);

	return s;
}

//__________________________________________________________________
function processMixin(feed,mixin,mixinName) {
	if (checkReleaseStatus(mixin.release_status)) {
		if (seen.indexOf(mixinName)<0) {
			exportMixin(feed,mixin,mixinName);
			seen.push(mixinName);
		}
		else {
			console.log('* Skipping mixin '+mixinName+' as duplicate name');
		}
	}
	else {
		console.log('Skipping mixin '+mixinName+' as '+mixin.release_status);
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
	if (filter.prohibits) {
		s += prohibits(filter.prohibits);
	}

	if (filter.option) {
		filter.option = toArray(filter.option);
		for (var i in filter.option) {
			var option = filter.option[i];
			if (option.title) {
				s += '* option: '+option.value+', '+option.title+'\n';
				s += '*/\n';
				var optionName = filterName+('-'+option.value).toCamelCase();
				s += optionName+' : '+optionName +',\n';
				s += '/**\n';
				fs.appendFileSync(apijs, 'const '+optionName+" = '"+filter.name+'='+encodeURIComponent(option.value)+"';\n", 'utf8');
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
		}
	}
	s += '*/\n';

	//if (optionCount==0) {
	s += filterName + ' : '+filterName +',\n';
	fs.appendFileSync(apijs, 'const '+filterName+" = '"+filter.name+"';\n", 'utf8');
	cache.push(s);
	//}
	return optionCount;
}

//__________________________________________________________________
function processFilter(feed,filter,filterName) {
	if (checkReleaseStatus(filter.release_status)) {
		if (seen.indexOf(filterName)<0) {
			if (!filter.type) {
				console.log('++++++++++ typeless filter ++++++++ '+filterName);
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
		console.log('Skipping filter '+filterName+' as '+filter.release_status);
	}
}

//__________________________________________________________________
function processFeed(feed) {

	var feedName = ('nitro-'+feed.name).toCamelCase();
	fs.appendFileSync(apijs, 'const '+feedName+" = '"+feed.href+"';\n", 'utf8');
	var s = '/**\n';
	s += '* '+feed.title+'\n';
	s += '*/\n';
	s += feedName+' : '+feedName+',\n';
	cache.push(s);

	var pathname = feed.href.replace('/nitro/api','');
	var path = swagger.paths[pathname] = {};
	path.get = {};
	path.get.description = feed.title;
	path.get.operationId = 'find'+feed.name;
	params = path.get.parameters = [];
	
	// "responses": {
          // "200": {
            // "description": "pet response",
            // "schema": {
              // "type": "array",
              // "items": {
                // "$ref": "#/definitions/Pet"
              // }
            // }
          // },
          // "default": {
            // "description": "unexpected error",
            // "schema": {
              // "$ref": "#/definitions/Error"
            // }
          // }
        // }
	
	path.get.responses = {};
	path.get.responses['200'] = {};
	path.get.responses['200'].description = 'Nitro response';
	path.get.responses.default = {};
	path.get.responses.default.description = 'Unexpected error';

	if (feed.sorts) {
		feed.sorts.sort = toArray(feed.sorts.sort); // only necessary if json api converted from xml
		if (feed.sorts.sort instanceof Array) {
			for (var i in feed.sorts.sort) {
				var sort = feed.sorts.sort[i];
				var sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
				processSort(feed,sort,sortName);
			}
		}
	}

	if (feed.mixins) {
		feed.mixins.mixin = toArray(feed.mixins.mixin); // only necessary if json api converted from xml
		for (var i in feed.mixins.mixin) {
			var mixin = feed.mixins.mixin[i];
			var mixinName = ('m-'+feed.name+'-'+mixin.name).toCamelCase();
			processMixin(feed,mixin,mixinName);
		}
	}

	if (feed.filters) {
		feed.filters.filter = toArray(feed.filters.filter); // only necessary if json api converted from xml
		for (var i in feed.filters.filter) {
			var filter = feed.filters.filter[i];
			var filterName = ('f-'+feed.name+'-'+filter.name).toCamelCase();
			processFilter(feed,filter,filterName);
		}
	}

}

//__________________________________________________________________
function initSwagger() {
	return JSON.parse(`{
	  "swagger": "2.0",
	  "info": {
		"version": "1.0.0",
		"title": "BBC Nitro API",
		"description": "BBC Nitro is the BBC's application programming interface (API) for BBC Programmes Metadata.",
		"termsOfService": "http://www.bbc.co.uk/terms/",
		"contact": {
		  "name": "Nitro Swagger Resource",
		  "email": "mike.ralphson@gmail.com",
		  "url": "http://mermade.github.io/"
		},
		"license": {
		  "name": "Nitro Public License",
		  "url": "https://developer.bbc.co.uk/nitropubliclicence/"
		}
	  },
	  "host": "bbc.co.uk",
	  "basePath": "/nitro/api",
	  "schemes": [
		"http"
	  ],
	  "consumes": [
		"application/json"
	  ],
	  "produces": [
		"application/json",
		"application/xml"
	  ],
	  "paths": {
	  }
	}`);
}

//__________________________________________________________________

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

var feed;
for (var f in api.feeds.feed) {
	feed = api.feeds.feed[f];
	if (checkReleaseStatus(feed.release_status)) {
		processFeed(feed);
	}
	else {
		console.log('Skipping feed '+feed.name+' as '+feed.release_status);
	}
}

process.on('exit',function(){
	fs.appendFileSync(apijs, "const apiHash = '" + digest + "';\n", 'utf8');
	fs.appendFileSync(apijs, '\nmodule.exports = {\n');
	for (var i in cache) {
		fs.appendFileSync(apijs, cache[i]);
	}

	fs.appendFileSync(apijs, 'apiHash : apiHash\n', 'utf8');
	fs.appendFileSync(apijs, '}\n', 'utf8');

	fs.closeSync(api_fh);

	fs.writeFileSync('./nitroApi/swagger.json',JSON.stringify(swagger,null,'\t'));
});