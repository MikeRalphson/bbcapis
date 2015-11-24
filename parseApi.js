var fs = require('fs');
var crypto = require('crypto');
var stream = require('stream');

var apistr = fs.readFileSync('./api/api.json', 'utf8');
var api = JSON.parse(apistr);

var apijs = './nitroApi.js';
var api_fh = fs.openSync(apijs,'w');

fs.appendFileSync(apijs, 'module.exports = {\n', 'utf8');

//__________________________________________________________________

String.prototype.toCamelCase = function camelize() {
	return this.toLowerCase().replace(/[-_](.)/g, function(match, group1) {
		return group1.toUpperCase();
    });
}

//__________________________________________________________________
function toArray(item) {
	if (!(item instanceof Array)) {
		for (j in item) {
			if (item[j].length>1) {
				toArray(item[j]);
			}
		}
		newitem = [];
		newitem.push(item);
		return newitem;
		//item = newitem;
	}
	else {
		return item;
	}
}

//__________________________________________________________________
function exportSortDirection(feed,sort,sortDirection,sortDirectionName) {
	s = sortDirectionName+' : function '+sortDirectionName+'(qs){\n';
	s += '  // '+sort.title+'\n';
	if (sortDirection.href) {
		s += '  // ' +sortDirection.href+'\n';
	}
	s += "  qs=qs+'&sort="+sort.name+"&sort-direction="+sortDirection.value+"';\n";
	s += '  return qs;\n';
	s += '},\n';
	fs.appendFileSync(apijs, s, 'utf8');
	return s;
}

//__________________________________________________________________
function processSortDirection(feed,sort,sortDirection,sortDirectionName) {
	//console.log('    sort direction '+sortDirectionName+' '+sortDirection.is_default);
	exportSortDirection(feed,sort,sortDirection,sortDirectionName);
}

//__________________________________________________________________
function exportSort(feed,sort,sortName) {
	s = sortName + ' : function '+sortName+'(qs){\n';
	s += '  // '+sort.title+'\n';
	s += '  // note that this sort has no sort-direction\n';
	if (sort.href) {
		s += '  // ' +sort.href+'\n';
	}
	s += "  qs=qs+'&sort="+sort.name+"';\n";
	s += '  return qs;\n';
	s += '},\n';
	fs.appendFileSync(apijs, s, 'utf8');
	return s;
}

//__________________________________________________________________
function processSort(feed,sort,sortName) {
	if (sort.release_status!='deprecated') {
		//console.log('  sort '+sortName+' '+sort.title);
		if (sort.sort_direction) {
			sort.sort_direction = toArray(sort.sort_direction); // I expect in the official API this will always be the case
			for (i in sort.sort_direction) {
				sortDirection = sort.sort_direction[i];
				sortDirectionName = ('s-'+feed.name+'-'+sort.name+'-'+sortDirection.value).toCamelCase();
				processSortDirection(feed,sort,sortDirection,sortDirectionName);
			}
		}
		else {
			exportSort(feed,sort,sortName);
			//sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
			//processSort(feed,sort,sortName);
		}
	}
	else {
		console.log('Skipping '+sortName+' as '+sort.release_status);
	}
}

//__________________________________________________________________
function exportMixin(feed,mixin,mixinName) {
	s = mixinName+' : function '+mixinName+'(qs){\n';
	s += '  // '+mixin.title+'\n';
	if (mixin.href) {
		s += '  // ' +mixin.href+'\n';
	}
	s += "  qs=qs+'&mixin="+mixin.name+"';\n";
	s += '  return qs;\n';
	s += '},\n';
	fs.appendFileSync(apijs, s, 'utf8');
	return s;
}

//__________________________________________________________________
function processMixin(feed,mixin,mixinName) {
	if (mixin.release_status!='deprecated') {
		//console.log('  mixin '+mixinName+' '+mixin.title);
		exportMixin(feed,mixin,mixinName);
	}
	else {
		console.log('Skipping '+mixinName+' as '+mixin.release_status);
	}
}

//__________________________________________________________________
function exportFilter(feed,filter,filterName) {
	s = filterName + ' : function '+filterName+'(qs,value){\n';
	s += '  // '+filter.title+'\n';
	if (filter.href) {
		s += '  // '+filter.href+'\n';
	}
	
	if (filter.option) {
		filter.option = toArray(filter.option);
		for (i in filter.option) {
			option=filter.option[i];
			if (option.title) {
				s += '  // '+option.title+'\n';
			}
			if (option.href) {
				s += '  // '+option.href+'\n';
			}
		}
	}
	
	s += "  qs=qs+'&"+filter.name+"=value';\n";
	s += '  return qs;\n';
	s += '},\n';
	fs.appendFileSync(apijs, s, 'utf8');
	return s;
}

//__________________________________________________________________
function processFilter(feed,filter,filterName) {
	if (filter.release_status!='deprecated') {
		//.log('  filter '+filterName+' '+filter.title);
		if (!filter.type) {
			console.log('++++++++++ typeless filter ++++++++ '+filterName);
		}
		exportFilter(feed,filter,filterName);
	}
	else {
		console.log('Skipping filter '+filterName+' as '+filter.release_status);
	}
}

//__________________________________________________________________
function processFeed(feed) {
	if (feed.sorts) {
		feed.sorts.sort = toArray(feed.sorts.sort); // I expect in the official API this will always be the case
		if (feed.sorts.sort instanceof Array) {
			for (i in feed.sorts.sort) {
				sort = feed.sorts.sort[i];
				sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
				processSort(feed,sort,sortName);
			}
		}
	}

	if (feed.mixins) {
		feed.mixins.mixin = toArray(feed.mixins.mixin); // I expect in the official API this will always be the case
		for (i in feed.mixins.mixin) {
			mixin = feed.mixins.mixin[i];
			mixinName = ('m-'+feed.name+'-'+mixin.name).toCamelCase();
			processMixin(feed,mixin,mixinName);
		}
	}

	if (feed.filters) {
		feed.filters.filter = toArray(feed.filters.filter); // I expect in the official API this will always be the case
		for (i in feed.filters.filter) {
			filter = feed.filters.filter[i];
			filterName = ('f-'+feed.name+'-'+filter.name).toCamelCase();
			processFilter(feed,filter,filterName);
		}
	}

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

for (var f in api.feeds.feed) {
	feed = api.feeds.feed[f];
	console.log('----------------------');
	if (feed.name) {
		console.log(('-'+feed.name).toCamelCase()+'  '+feed.title);
		//if (feed.name.toLowerCase()=='items') {
		processFeed(feed);
		//}
	}
	else {
		console.log(feed);
	}
}

process.on('exit',function(){
	fs.appendFileSync(apijs, 'nop : function nop() {}\n', 'utf8');
	fs.appendFileSync(apijs, '}', 'utf8');
	fs.closeSync(api_fh);

	console.log();
	console.log('API hash='+digest);
});