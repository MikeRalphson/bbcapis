var fs = require('fs');
var crypto = require('crypto');
var stream = require('stream');

var apistr = fs.readFileSync('./api/api.json', 'utf8');
var api = JSON.parse(apistr);

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
function exportSort(sort) {
	if (sort.sort_directions) {
		for (j in sort.sort_directions.sortDirection) {
			console.log(sort.sort_directions.sort_direction[j]);
		}
	}

	s = 'function sort'+sort.name+'(';
	if (sort.sort_direction) {
		s += 'sortDirection){\n';
		sd = '';
	}
	else {
		s+='){\n';
	}
	s += '//'+sort.title+'\n';
	if (sort.sort_directions) {
		for (j in sort.sort_directions.sort_direction) {
			sd = sort.sort_directions.sort_direction[j];
			s += '// sortDirection '+sd.name+' '+sd.release_status+'\n';
		}
	}
	s += "var s='';\n"
	s += "var s='&sort='"+sort.name+"';\n";
	s += "if (sortDirection){\n";
	s += "  s+='sort_direction='+sortDirection;\n";
	s += "}\n";
	s += 'return s;\n';
	s += '}\n';

	return s;
}

//__________________________________________________________________
function processSortDirection(feed,sort,sortDirection,sortDirectionName) {
	console.log('    sort direction '+sortDirectionName+' '+sortDirection.is_default);
}

//__________________________________________________________________
function processSort(feed,sort,sortName) {
		/*
	{ sort:
      { title: 'sort by pid, descending',
        release_status: 'supported',
        name: 'pid',
        is_default: 'true',
        sort_direction: [Object] } }
	}
		*/
	if (sort.release_status!='deprecated') {
		console.log('  sort '+sortName+' '+sort.title);
		if (sort.sort_direction) {
			//console.log(sort.sort_direction);
			sort.sort_direction = toArray(sort.sort_direction); // I expect in the official API this will always be the case
			for (i in sort.sort_direction) {
				sortDirection = sort.sort_direction[i];
				sortDirectionName = ('sd-'+feed.name+'-'+sort.name+'-'+sortDirection.name).toCamelCase();
				processSortDirection(feed,sort,sortDirection,sortDirectionName);
			}
		}
	}
	else {
		console.log('Skipping '+sortName+' as '+sort.release_status);
	}
}

//__________________________________________________________________
function processMixin(feed,mixin,mixinName) {
	if (mixin.release_status!='deprecated') {
		console.log('  mixin '+mixinName+' '+mixin.title);
		//console.log(mixin);
	}
	else {
		console.log('Skipping '+mixin.title+' as '+mixin.release_status);
	}
}

//__________________________________________________________________
function exportFilter(filterName) {
	// s = 'function '+filterName+'(';
	// if (sort.sort_direction) {
		// s += 'sortDirection){\n';
		// sd = '';
	// }
	// else {
		// s+='){\n';
	// }
	// s += '//'+sort.title+'\n';
	// if (sort.sort_directions) {
		// for (j in sort.sort_directions.sort_direction) {
			// sd = sort.sort_directions.sort_direction[j];
			// s += '// sortDirection '+sd.name+' '+sd.release_status+'\n';
		// }
	// }
	// s += "var s='';\n"
	// s += "var s='&sort='"+sort.name+"';\n";
	// s += "if (sortDirection){\n";
	// s += "  s+='sort_direction='+sortDirection;\n";
	// s += "}\n";
	// s += 'return s;\n';
	// s += '}\n';
		
	// return s;
}

//__________________________________________________________________
function processFilter(feed,filter,filterName) {
	if (filter.release_status!='deprecated') {
		console.log('  filter '+filterName+' '+filter.title);
		exportFilter(feed,filter,filterName);
	}
	else {
		console.log('Skipping '+filter.title+' as '+filter.release_status);
	}
}

//__________________________________________________________________
function processFeed(feed) {
	if (feed.sorts) {
		feed.sorts.sort = toArray(feed.sorts.sort); // I expect in the official API this will always be the case
		if (feed.sorts.sort instanceof Array) {
			for (i in feed.sorts.sort) {
				sort = feed.sorts.sort[i];
				//console.log(sort);
				sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
				processSort(feed,sort,sortName);
			}
		}
		//else {
		//	sort = feed.sorts.sort;
		//	console.log(sort);
		//	sortName = ('s-'+feed.name+'-'+sort.name).toCamelCase();
		//	processSort(feed,sort,sortName);
		//}
	}

	if (feed.mixins) {
		feed.mixins.mixin = toArray(feed.mixins.mixin); // I expect in the official API this will always be the case
		for (i in feed.mixins.mixin) {
			mixin = feed.mixins.mixin[i];
			mixinName = ('mx-'+feed.name+'-'+mixin.name).toCamelCase();
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
	//console.log('----------------------');
	if (feed.name) {
		console.log(('-'+feed.name).toCamelCase()+'  '+feed.title);
		if (feed.name.toLowerCase()=='items') {
			processFeed(feed);
		}
	}
	else {
		console.log(feed);
	}
}

process.on('exit',function(){
	console.log();
	console.log('API hash='+digest);
});