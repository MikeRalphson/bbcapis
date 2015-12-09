/*

List programmes by aggregation (category, format, or search)

*/
'use strict';

var http = require('http');
//var https = require('https');
var fs = require('fs');
var util = require('util');
var url = require('url');
var common = require('./common');
var helper = require('./apiHelper');
var api = require('./nitroApi/api');

var programme_cache = [];
var download_history = [];
var showAll = false;
var dest = '';

// http://nitro.api.bbci.co.uk
// http://nitro.stage.api.bbci.co.uk/nitro/api/
// http://d.bbc.co.uk/nitro/api/
// http://d.bbc.co.uk/stage/nitro/api/
// https://api.live.bbc.co.uk/nitro/api/
// http://nitro-e2e.api.bbci.co.uk/nitro-e2e/api/

var host = 'd.bbc.co.uk';
var domain = '/nitro/api';
var feed = '/programmes';
var mediaSet = 'pc';
var api_key = '';

var service = 'radio';
var media_type = 'audio';
const pageSize = 30;

var debuglog = util.debuglog('bbc');

//-----------------------------------------------------------------------------

function logFault(fault) {
/*
{ "fault": {
	"faultstring": "Rate limit quota violation. Quota limit : 0 exceeded by 1. Total violation count : 1. Identifier : YOUR-API-KEY-HERE",
	"detail":
		{"errorcode": “policies.ratelimit.QuotaViolation"}
	}
}
*/
	console.log(fault.fault.detail.errorcode+': '+fault.fault.faultstring);
}

function logError(error) {
/*
{"errors":{"error":{"code":"XDMP-EXTIME","message":"Time limit exceeded"}}}
*/
	console.log(error.errors.error.code+': '+error.errors.error.message);
}

//----------------------------------------------------------------------------

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

		var present = download_history.indexOf(p.pid)>=0;

		var title = (p.title ? p.title : p.presentation_title);
		var parents = '';
		var ancestor_titles = '';
		for (var at in p.ancestor_titles) {
			present = present || (download_history.indexOf(p.ancestor_titles[at].pid)>=0);
			var t = '';
			if (p.ancestor_titles[at].title) {
				t = p.ancestor_titles[at].title;
			}
			else if (p.ancestor_titles[at].presentation_title) {
				t = p.ancestor_titles[at].presentation_title;
			}
			if (p.ancestor_titles[at].ancestor_type != 'episode') {
				ancestor_titles += t + ' : ';
			}
			else if (!title) {
				title = t;
			}
			parents += '  ' + p.ancestor_titles[at].pid + ' ('+t+') ';
		}
		title = ancestor_titles + title;
		parents += '  ' + p.version.pid + ' (vPID)';

		var available = (p.versions.available > 0);

		if  ((!present && available) || (programme_cache.length==1) || showAll) {

			if (programme_cache.length==1) {
				console.log(p);
			}

			var position = p.episode_of ? p.episode_of.position : 1;
			var totaleps = 1;
			var series = 1;

			//
			var subp = p;
			while ((subp.programme) || (subp.parent)) {
				var newp = subp.programme;
				if (!newp) newp = subp.parent.programme;
				subp = newp;
				if (subp.type == 'series') {
					if (subp.expected_child_count) totaleps = subp.expected_child_count;
					if (subp.position) series = subp.position;
				}
			}

			console.log(p.pid+' '+p.item_type+' '+p.media_type+' '+(available ? 'Available' : 'Unavailable')+'  '+title);

			var len = (p.version && p.version.duration) ? p.version.duration : '0s';
			len = len.replace('PT','').toLocaleLowerCase(); // ISO 8601 duration

			//for (var v in p.versions.version) {
			//	console.log(p.versions.version[v]);
				//for (var va in p.versions.version[v].availabilities) {
				//	a = p.versions.version[v].availabilities[va];
				//	// dump mediasets
				//	for (var vaa in a) {
				//		var vaaa = a[vaa];
				//		for (var ms in vaaa.media_sets.media_set) {
				//			console.log(vaaa.media_sets.media_set[ms]);
				//		}
				//	}
				//}
			//}

			console.log('  '+len+' S'+pad(series,'00')+'E'+pad(position,'00')+
				'/'+pad(totaleps,'00')+' '+(p.synopses.short ? p.synopses.short : 'No description'));
			if (parents) console.log(parents);
			if (p.master_brand) {
				console.log('  '+p.master_brand.mid+' @ '+p.release_date);
			}
			if (p.version.start_time) {
				// only occurs if p converted from a broadcast
				console.log('  '+p.version.sid+' @ '+p.version.start_time);
			}

			if (p.contributions) {
				console.log();
				for (var c in p.contributions.contribution) {
					var cont = p.contributions.contribution[c];
					console.log((cont.character_name ? cont.character_name : cont.credit_role.$)+' - '+
						cont.contributor.name.given+' '+cont.contributor.name.family);
				}
			}
		}
		else {
			hidden++;
		}
	}
	console.log();
	console.log('Cache has '+programme_cache.length+' entries, '+hidden+' hidden');
}

//_____________________________________________________________________________
var processResponse = function(obj) {
	var nextHref = '';
	if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
		nextHref = obj.nitro.pagination.next.href;
		//console.log(nextHref);
	}
	var pageNo = obj.nitro.results.page;
	var top = obj.nitro.results.total;
	if (!top) {
		top = obj.nitro.results.more_than+1;
	}
	var last = Math.ceil(top/obj.nitro.results.page_size);
	//console.log('page '+pageNo+' of '+last);
	process.stdout.write('.');

	var length = 0;
	if (obj.nitro.results.items) {
		length = obj.nitro.results.items.length;
	}

	if (length==0) {
		console.log('No results returned');
	}
	else {
		for (var i in obj.nitro.results.items) {
			var p = obj.nitro.results.items[i];
			debuglog(p);
			if ((p.item_type == 'episode') || (p.item_type == 'clip'))  {
				add_programme(p);
			}
			else if ((p.item_type == 'series') || (p.item_type == 'brand')) {
				var path = domain+feed;
				var query = helper.newQuery(api.fProgrammesDescendantsOf,p.pid,true)
					.add(api.fProgrammesAvailabilityAvailable)
					//.add(api.fProgrammesAvailabilityTypeOndemand)
					.add(api.fProgrammesMediaSet,mediaSet)
					.add(api.mProgrammesDuration)
					.add(api.mProgrammesAncestorTitles)
					.add(api.mProgrammesAvailability)
					.add(api.mProgrammesVersionsAvailability)
					.add(api.fProgrammesEntityTypeEpisode)
					.add(api.fProgrammesPageSize,pageSize);

				if (media_type) {
					query.add(api.fProgrammesMediaType,media_type);
				}
				process.stdout.write('>');
				make_request(host,path,api_key,query,processResponse);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}

	dest = {};
	if (pageNo<last) {
		dest.path = domain+feed;
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = processResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	return dest;
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

function make_request(host,path,key,query,callback) {
	//console.log(host+path+'?K'+query.querystring);
	var options = {
	  hostname: host
	  ,port: 80
	  ,path: path+'?api_key='+key+query.querystring
	  ,method: 'GET'
	  ,headers: { 'Content-Type': 'application/json',
					'Accept': 'application/json',
		'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-gb; HTC_DesireZ_A7272 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
	  }
	};

	var list = '';
	var obj;

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
			path = locUrl.pathname;
			host = locUrl.host;
			make_request(host,path,key,query,callback);
		}
		else if (res.statusCode >= 400 && res.statusCode < 600) {
			console.log(res.statusCode+' '+res.statusMessage);
			if (list) {
				try {
					obj = JSON.parse(list);
					if (obj.fault) {
						logFault(obj);
					}
					else if (obj.errors) {
						logError(obj);
					}
					else {
						console.log('Unknown response object');
						console.log(obj);
					}
				}
				catch (err) {
					console.log(err);
					console.log('Invalid JSON received:');
					console.log(list);
				}
			}
		}
		else try {
			obj = JSON.parse(list);
			var result = callback(obj);
		    if (dest.callback) {
				// call the callback's next required destination
				// e.g. second and subsequent pages
				if (dest.path) {
					make_request(host,dest.path,key,dest.query,dest.callback);
				}
				else {
					dest.callback();
				}
			}
		}
		catch(err) {
			console.log('Something went wrong parsing the response JSON');
			console.log(err);
			console.log(res.statusCode+' '+res.statusMessage);
			console.log(res.headers);
			console.log('** '+list);
		}
	   });
	});
	req.on('error', function(e) {
	  console.log('Problem with request: ' + e.message);
	});
	req.end();
}

//_____________________________________________________________________________
function dispatch(obj) {
	if (obj.nitro) {
		processResponse(obj);
	}
	else if (obj.fault) {
		logFault(obj);
	}
	else if (obj.errors) {
		logError(obj);
	}
	else {
		console.log(obj);
	}
	return {};
}

//_____________________________________________________________________________
function processPid(host,path,api_key,pid) {	
	var pidList = [];
	if (pid.indexOf('@')==0) {
		pid = pid.substr(1);
		var s = fs.readFileSync(pid,'utf8');
		pidList = s.split('\n');
	}
	else {
		pidList.push(pid);
	}
	for (var p in pidList) {
		pid = pidList[p].split('#')[0].trim();
		var query = helper.newQuery();
		query.add(api.fProgrammesPageSize,pageSize,true)
			.add(api.mProgrammesContributions)
			.add(api.mProgrammesDuration)
			.add(api.mProgrammesAncestorTitles)
			.add(api.mProgrammesVersionsAvailability)
			.add(api.fProgrammesPid,pid);
		make_request(host,path,api_key,query,function(obj){
			return dispatch(obj);
		});
	}
}

//_____________________________________________________________________________
var scheduleResponse = function(obj) {
	var nextHref = '';
	if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
		nextHref = obj.nitro.pagination.next.href;
		//console.log(nextHref);
	}
	var pageNo = obj.nitro.results.page;
	var top = obj.nitro.results.total;
	if (!top) {
		top = obj.nitro.results.more_than+1;
	}
	var last = Math.ceil(top/obj.nitro.results.page_size);
	//console.log('page '+pageNo+' of '+last);
	process.stdout.write('.');

	var length = 0;
	if (obj.nitro.results.items) {
		length = obj.nitro.results.items.length;
	}

	if (length==0) {
		console.log('No results returned');
	}
	else {
		for (var i in obj.nitro.results.items) {
			var item = obj.nitro.results.items[i];
			
			console.log();
			console.log(item);
			
			// minimally convert a broadcast into a programme for display
			var p = {};
			p.ancestor_titles = item.ancestor_titles;
			p.versions = {};
			p.versions.available = 1;
			p.version = {};
			p.version.duration = item.published_time.duration;
			p.version.start_time = item.published_time.start;
			p.version.sid = item.service.sid;
			p.synopses = {};
			p.media_type = service;
			
			for (var b in item.broadcast_of) {
				var bof = item.broadcast_of[b];
				if ((bof.result_type == 'episode') || (bof.result_type == 'clip')) {
					p.item_type = bof.result_type;
					p.pid = bof.pid;
				}
				else if (bof.result_type == 'version') {
					p.version.pid = bof.pid;
				}
			}
			for (var a in item.ancestor_titles) {
				var at = item.ancestor_titles[a];
				if ((at.ancestor_type == 'episode') || (at.ancestor_type == 'clip')) {
					p.title = at.title;
				}
			}
			
			// item.ids.id is an array of submissions(?) to broadcast schedule services
			
			var present = false;
			for (var pc in programme_cache) {
				var pci = programme_cache[pc];
				if (pci.pid == p.pid) present = true;
			}
			if (!present) programme_cache.push(p);
		}
	}
	
	dest = {};
	if (pageNo<last) {
		dest.path = '/nitro/api/schedules';
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = scheduleResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	return dest;
}

//_____________________________________________________________________________
function processSchedule(host,api_key,category) {
	var path = '/nitro/api/schedules';
	var query = helper.newQuery();
	if (process.argv.length>4) {
		if (process.argv[4] == 'search') {
			//? title: or synopses: keywords, boolean operators
			query.add(api.fSchedulesQ,category,true).add(api.sSchedulesTitleAscending);
		}
		else if (process.argv[4] == 'format') {
			query.add(api.fSchedulesFormat,category,true);
		}
		else {
			query.add(api.fSchedulesGenre,category,true);
		}
	}
	else {
		query.add(api.fSchedulesGenre,category,true);
	}
	
	var today = new Date();
	var todayStr = today.toISOString();
	
	query.add(api.mSchedulesAncestorTitles);
	query.add(api.fSchedulesStartFrom,todayStr);
	query.add(api.fSchedulesPageSize,30);
	
	make_request(host,path,api_key,query,function(obj){
		var result = scheduleResponse(obj);
		if (dest.callback) {
			// call the callback's next required destination
			// e.g. second and subsequent pages
			if (dest.path) {
				make_request(host,dest.path,api_key,dest.query,dest.callback);
			}
			else {
				dest.callback();
			}
		}		
	});
}

//------------------------------------------------------------------------[main]

// https://developer.bbc.co.uk/nitropubliclicence

// https://admin.live.bbc.co.uk/nitro/admin/servicestatus
// https://api.live.bbc.co.uk/nitro/api/schema
// https://confluence.dev.bbc.co.uk/display/nitro/Nitro+run+book
// http://www.bbc.co.uk/academy/technology/article/art20141013145843465

var config = require('./config.json');
download_history = common.downloadHistory(config.download_history);
host = config.nitro.host;
api_key = config.nitro.api_key;
mediaSet = config.nitro.mediaset;

var defcat = 'C00035'; //'200032'; //'drama/scifiandfantasy'; 100003=Drama
var category = defcat;

var query = helper.newQuery();
var pid = '';
var upcoming = false;
var path = domain+feed;

if (process.argv.length>2) {
	category = process.argv[2];
}

if (process.argv.length>3) {
	service = process.argv[3];
	if (service == 'tv') {
		media_type = 'audio_video';
	}
	else if (service == 'both') {
		media_type = '';
	}
}

if (process.argv.length>5) {
	pid = process.argv[5];
}
if (pid=='all') {
	showAll = true;
	pid = '';
}
else if (pid=='upcoming') {
	upcoming = true;
	pid = '';
}

if (pid!='') {
	if (pid=='schedule') {
		processSchedule(host,api_key,category);
	}
	else {
		processPid(host,path,api_key,pid);
	}
}
else {
	if (process.argv.length>4) {
		if (process.argv[4] == 'search') {
			//? title: or synopses: keywords, boolean operators
			query.add(api.fProgrammesQ,category,true).add(api.sProgrammesTitleAscending);
		}
		else if (process.argv[4] == 'format') {
			query.add(api.fProgrammesFormat,category,true);
		}
		else {
			query.add(api.fProgrammesGenre,category,true);
		}
	}
	else {
		query.add(api.fProgrammesGenre,category,true);
	}

	if (upcoming) {
		query.add(api.fProgrammesAvailabilityPending);		
	}
	else {
		query.add(api.fProgrammesAvailabilityAvailable);
	}
	query.add(api.mProgrammesAvailability)
		.add(api.fProgrammesMediaSet,mediaSet)
		.add(api.fProgrammesEntityTypeEpisode);
		//.add(api.fProgrammesAvailabilityTypeOndemand)
	if (media_type) {
		query.add(api.fProgrammesMediaType,media_type);
	}

	query.add(api.fProgrammesPageSize,pageSize)
		.add(api.mProgrammesDuration)
		.add(api.mProgrammesAncestorTitles)
		.add(api.mProgrammesVersionsAvailability);

	if (category.indexOf('-h')>=0) {
		console.log('Usage: '+process.argv[1]+' category service_type format|genre|search [PID|@list|all|upcoming|schedule]');
		console.log();
		console.log('Category defaults to '+defcat);
		console.log('Service_type defaults to '+service+' values radio|tv|both');
		console.log('Aggregation defaults to genre');
		console.log('PID defaults to all PIDS');
	}
	else {
		make_request(host,path,api_key,query,function(obj){
			return dispatch(obj);
		});
	}
}

process.on('exit', function(code) {
  pc_dump(pid);
});