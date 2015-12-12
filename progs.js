/*

List programmes by aggregation (category, format, but not tags, they have been removed)

*/
'use strict';

var http = require('http');
var fs = require('fs');
var url = require('url');
var util = require('util');
var getopt = require('node-getopt');
var common = require('./common');

var programme_cache = [];
var download_history = [];
var domain = 'radio';
var displayDomain = domain;
var pid = '';
var availableOnly = false;

var debuglog = util.debuglog('bbc');

var add_programme = function(obj) {
	programme_cache.push(obj);
};

//-----------------------------------------------------------------------------

function pad(str, padding, padRight) {
	if (typeof str === 'undefined')
		return padding;
	if (padRight) {
		return (str + padding).substring(0, padding.length);
	} else {
		return (padding + str).slice(-padding.length);
	}
}

//-----------------------------------------------------------------------------

function pc_dump() {

var hidden = 0;

	console.log('\n* Programme Cache:');
	for (var i in programme_cache) {
		var p = programme_cache[i];

		var present = (common.binarySearch(download_history,p.pid)>=0);

		var totaleps = 1;
		var series = 1;
		var parents = '';
		var position = p.position ? p.position : 1;
		var ownership = p.ownership;

		var title = (p.display_title ? p.display_title.title+
			(p.display_title.subtitle ? '/' : '')+p.display_title.subtitle : p.title);

		var subp = p;
		while ((subp.programme) || (subp.parent) && (!present)) {
			var newp = subp.programme;
			if (!newp) newp = subp.parent.programme;
			subp = newp;

			present = (present || (common.binarySearch(download_history,subp.pid)>=0));

			if (subp.type == 'series') {
				if (subp.expected_child_count) totaleps = subp.expected_child_count;
				if (subp.position) series = subp.position;
			}
			if ((!ownership) && (subp.ownership)) {
				ownership = subp.ownership;
			}
			title = subp.title+'/'+title;
			parents += '  '+subp.type+'= '+subp.pid+' ('+subp.title+')';
		}

		var available = (!(p.is_available===false||p.is_available_mediaset_pc_sd===false));

		if ((!present) && (available || !availableOnly)) {
			console.log(p.pid+' '+p.type+' '+(ownership && ownership.service && ownership.service.type ?
			  ownership.service.type : displayDomain)+' '+
			  (available ? 'Available' : 'Unavailable')+'  '+title);

			var len = p.duration ? p.duration : 0;
			if (p.versions) {
				if (!len && (p.versions[0].duration)) {
					len = p.versions[0].duration;
				}
				for (var j in p.versions) {
					parents += (parents ? '\n' : '')+'  vPID= '+p.versions[j].pid+' ('+p.versions[j].types[0]+')';
				}
			}

			var suffix = 's';
			if (len>=60) {
				len = Math.floor(len/60);
				suffix = 'm';
			}
			if (len>=100) {
				len = Math.round(len/60);
				suffix = 'h';
			}

			console.log('  '+len+suffix+' S'+pad(series,'00')+'E'+pad(position,'00')+
				'/'+pad(totaleps,'00')+' '+(p.short_synopsis ? p.short_synopsis : 'No description'));
			if (parents) console.log(parents);

		}
		else {
			hidden++;
		}
	}
	console.log();
	console.log('Cache has '+programme_cache.length+' entries, '+hidden+' hidden');
}

//-----------------------------------------------------------------------------

function cat_slice_dump(obj) {
	console.log('* Category_slice dump');
	console.log(obj.category_slice.category.key+' = '+obj.category_slice.category.title);
	var len = obj.category_slice.programmes.length;
	//console.log('Contains '+len+' entries');
	for (var i in obj.category_slice.programmes) {
		var p = obj.category_slice.programmes[i];
		if ((p.type == 'episode') || (p.type == 'clip'))  {
			//add_programme(p); //? not enough info available
			common.pid_list(p.type,p,true,false,add_programme);
		}
		else if ((p.type == 'series') || (p.type == 'brand')) {
			common.pid_list(p.type,p,false,false,add_programme);
		}
		else {
			console.log('Unhandled type: '+p.type);
		}
	}
}

//-----------------------------------------------------------------------------

function cat_page_list(obj) {
    debuglog(obj);
	console.log('* Category_page list');
	console.log(obj.category_page.category.key+' = '+obj.category_page.category.title);
	//var len = obj.category_page.available_programmes.length;
	//console.log('Contains '+len+' entries');
	for (var i in obj.category_page.available_programmes) {
		var p = obj.category_page.available_programmes[i];
		if ((p.type == 'episode') || (p.type == 'clip'))  {
			add_programme(p); //? faster than querying each PID
		}
		else if ((p.type == 'series') || (p.type == 'brand')) {
			common.pid_list(p.type,p,false,false,add_programme);
		}
		else {
			console.log('Unhandled type: '+p.type);
			console.log(p);
		}
	}
}

//-------------------------------------------------------------------------------

function atoz_list(obj) {
	console.log('A to Z list');
	if (obj.atoz.tleo_titles.length===0) {
		console.log(obj);
	}
	else {
		for (var i in obj.atoz.tleo_titles) {
			var p = obj.atoz.tleo_titles[i].programme;
			debuglog(p);
			if ((p.type == 'episode') || (p.type == 'clip'))  {
				add_programme(p);
			}
			else if ((p.type == 'series') || (p.type == 'brand')) {
				common.pid_list(p.type,p,false,false,add_programme);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}
}

//----------------------------------------------------------------------------------

function episode_list(obj) {
	//console.log('Episodes list');
	if (!obj.episodes.length) {
		console.log(obj);
	}
	else {
		for (var i in obj.episodes) {
			var p = obj.episodes[i].programme;
			debuglog(p);
			if ((p.type == 'episode') || (p.type == 'clip'))  {
				add_programme(p);
			}
			else if ((p.type == 'series') || (p.type == 'brand')) {
				common.pid_list(p.type,p,false,false,add_programme);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
		return (obj.offset+obj.episodes.length<obj.total);
	}
}

//_____________________________________________________________________________
function broadcast_list(obj) {
	//console.log('Broadcast list');
	if (!obj.broadcasts.length) {
		console.log(obj);
	}
	else {
		for (var i in obj.broadcasts) {
			var p = obj.broadcasts[i].programme;
			debuglog(p);
			if ((p.type == 'episode') || (p.type == 'clip'))  {
				var present = false;
				for (var pc in programme_cache) {
					if (programme_cache[pc].pid == p.pid) {
						present = true;
					}
				}
				if (!present) add_programme(p); // allow for upcoming repeat broadcasts
			}
			else if ((p.type == 'series') || (p.type == 'brand')) {
				common.pid_list(p.type,p,false,false,add_programme);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
		return (obj.offset+obj.broadcasts.length<obj.total);
	}
}


//------------------------------------------------------------------------------

// snaffled from request module
function hasHeader(header, headers) {
	var headers = Object.keys(headers || this.headers),
		lheaders = headers.map(function (h) {return h.toLowerCase();});
	header = header.toLowerCase();
	for (var i=0;i<lheaders.length;i++) {
		if (lheaders[i] === header) return headers[i];
	}
	return false;
}

//------------------------------------------------------------------------------

function make_request(host,path) {
	console.log(host+path);
	var options = {
	  hostname: host
	  ,port: 80
	  ,path: path
	  ,method: 'GET'
	  ,headers: { 'Accept': 'application/json' }
	};

	var list = '';
	var cat;

	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		   list += data;
	  });
	  res.on('end', function() {
		if (res.statusCode >= 300 && res.statusCode < 400 && hasHeader('location', res.headers)) {
			// handle redirects, as per request module
			var location = res.headers[hasHeader('location', res.headers)];
			var locUrl = url.parse(location);
			host = locUrl.host;
			path = locUrl.path;
			make_request(host,path);
		}
		else if (res.statusCode >= 400 && res.statusCode < 600) {
			console.log(res.statusCode+' '+res.statusMessage);
		}
		else try {
			var obj = JSON.parse(list);
			if (obj.category_page) {
				cat_page_list(obj);
			}
			else if (obj.category_slice) {
				cat_slice_dump(obj);
			}
			else if (obj.episodes) {
				if (episode_list(obj)) {
					var page = 1;
					if (path.indexOf('?')>0) {
						var qs = path.split('?')[1];
						path = path.split('?')[0];
						page = parseInt(qs.split('=')[1],10);
					}
					page++;
					path = path+'?page='+page;
					make_request(host,path);
				}
			}
			else if (obj.broadcasts) {
				if (broadcast_list(obj)) {
					var page = 1;
					if (path.indexOf('?')>0) {
						var qs = path.split('?')[1];
						path = path.split('?')[0];
						page = parseInt(qs.split('=')[1],10);
					}
					page++;
					path = path+'?page='+page;
					make_request(host,path);
				}
			}
			else {
				atoz_list(obj); //tleo_titles
			}
		}
		catch(err) {
			if ((res.statusCode>=400) && (res.statusCode<600)) {
				console.log(res.statusCode+' '+res.statusMessage);
			}
			else {
				console.log('Something went wrong parsing the category JSON');
				console.log(err);
				console.log(res.statusCode+' '+res.statusMessage);
				console.log(res.headers);
				console.log('** '+list);
			}
		}
	   });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.end();
}

//_____________________________________________________________________________
function processPid(pid){
	var obj = [];  // create a programme object stub
	if (pid.indexOf('@')===0) {
		pid = pid.substr(1);
		var s = fs.readFileSync(pid,'utf8');
		var pids = s.split('\n');
		for (var i in pids) {
			pid = pids[i].split('#')[0].trim();
			if (pid) {
				obj.pid = pid;
				common.pid_list('toplevel',obj,false,false,add_programme);
			}
		}
	}
	else {
		obj.pid = pid;
		common.pid_list('toplevel',obj,false,false,add_programme);
	}
}

//------------------------------------------------------------------------[main]

// radio mode
// http://www.bbc.co.uk/radio/programmes/genres/drama/scifiandfantasy/player.json
// http://www.bbc.co.uk/radio/programmes/genres/drama/player.json
// http://www.bbc.co.uk/radio/programmes/genres/comedy/player.json
// http://www.bbc.co.uk/radio/programmes/genres/comedy/player/episodes.json[?page=n]
// http://www.bbc.co.uk/radio/programmes/genres/drama/scifiandfantasy/schedules/upcoming.json[?page=n]
//
// http://www.bbc.co.uk/radio4/programmes/schedules/fm/this_week.json
// www.bbc.co.uk/radio4/programmes/schedules/fm/this_week.json
// www.bbc.co.uk/radio4extra/programmes/schedules/2014/11/1.json
// www.bbc.co.uk/bbcfour/programmes/schedules/last_week.json

// TV mode
// http://bbc.co.uk/programmes/films.json
// redirects to http://open.live.bbc.co.uk/aps/programmes/a-z/by/films/all.json
// http://www.bbc.co.uk/programmes/genres/comedy/spoof.json
// http://www.bbc.co.uk/programmes/genres/comedy/player/episodes.json[?page=n]
// http://www.bbc.co.uk/tv/programmes/genres/drama/scifiandfantasy/schedules/upcoming.json[?page=n]

var config = require('./config.json');
download_history = common.downloadHistory(config.download_history);

var defcat = 'drama/scifiandfantasy';
var category = defcat;
var page = '/player';

availableOnly = false;
var cat_prefix = 'genres/';
var mode = 'genre';

var options = getopt.create([
	['h','help','display this help'],
	['f','format=ARG','Set category type=format and format=ARG'],
	['g','genre=ARG','Set category type=genre and genre=ARG'],
	['s','search=ARG','Search metadata. Can use title: or synopses: prefix'],
	['d','domain=ARG','Set domain = radio,tv or both'],
	['l','latest','Use latest feed'],
	['p','pid=ARG+','Query by individual pid(s), ignores options above'],
	['a','all','Show programmes only if available'],
	['u','upcoming','Show programme schedule information not history']
]);
options.bindHelp();

options.on('all',function(){
	availableOnly = true;
});
options.on('domain',function(argv,options){
	domain = options.domain;
	displayDomain = domain;
	if (domain=='tv') {
		domain = '';
	}
});
options.on('latest',function(){
	page = '/player/episodes';
});
options.on('pid',function(argv,options){
	mode = 'pid';
	for (var p in options.pid) {
		processPid(options.pid[p]);
	}
});
options.on('upcoming',function(){
	page = '/schedules/upcoming';
});
options.on('search',function(argv,options){
	category = options.search;
	mode = 'search';
});
options.on('format',function(argv,options){
	category = options.format;
	mode = 'format';
	cat_prefix = 'formats/';
});
options.on('genre',function(argv,options){
	category = options.genre;
	mode = 'genre';
});
var o = options.parseSystem();

if (mode == 'search') {
	category = encodeURIComponent(category);
	if (domain=='radio') {
		//http://www.bbc.co.uk/radio/programmes/a-z/by/doctor%20who/player
		cat_prefix = 'a-z/by/';
		page = '/all';
	}
	else {
		cat_prefix = '';
		page = '';
	}
}
category = cat_prefix + category;

if (domain) domain = '/'+domain;
var path = domain+'/programmes/'+category+page+'.json';

if (mode != 'pid') {
	make_request('www.bbc.co.uk',path);
}

process.on('exit', function(code) {
  pc_dump(pid);
});