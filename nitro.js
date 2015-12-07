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

// http://nitro.api.bbci.co.uk
// http://nitro.stage.api.bbci.co.uk/nitro/api/
// http://d.bbc.co.uk/nitro/api/
// http://d.bbc.co.uk/stage/nitro/api/
// https://api.live.bbc.co.uk/nitro/api/
// http://nitro-e2e.api.bbci.co.uk/nitro-e2e/api/

var host = 'd.bbc.co.uk';
var domain = '/nitro/api';
var feed = '/programmes';
const mediaSet = 'pc';
var api_key = '';

var service = 'radio';
var media_type = 'audio';
const pageSize = 300;

var dest = {};
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
			ancestor_titles += p.ancestor_titles[at].title + ' / ';
			parents += '  ' + p.ancestor_titles[at].pid + ' ('+p.ancestor_titles[at].title+') ';
		}
		title = ancestor_titles + title;

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
		console.log(nextHref);
	}
	var morePages = false;
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
	// if we need to go somewhere else, e.g. after all pages received set callback and/or query
	if (pageNo<last) {
		dest.path = domain+feed;
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = processResponse;
		return true;
	}
	else {
		return false;
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

function make_request(host,path,key,query,callback) {
	console.log(host+path+'?K'+query.querystring);
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
		else if (res.statusCode >= 400 && res.statusCode < 500) {
			console.log(res.statusCode+' '+res.statusMessage);
			if (list) {
				try {
					obj = JSON.parse(list);
					if (obj.fault.faultstring) {
						logFault(obj);
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
			callback(obj);
		    if (dest.callback) {
				// call the callback's next required destination
				// e.g. programme=pid getting a brand or series and calling children_of
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

var defcat = 'C00035'; //'200032'; //'drama/scifiandfantasy'; 100003=Drama
var category = defcat;

var query = helper.newQuery();
var pid = '';
var upcoming = false;

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
	query.add(api.fProgrammesPid,pid,true).add(api.mProgrammesContributions);
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
		.add(api.fProgrammesMediaSet,mediaSet).add(api.fProgrammesEntityTypeEpisode);
		//.add(api.fProgrammesAvailabilityTypeOndemand)
	if (media_type) {
		query.add(api.fProgrammesMediaType,media_type);
	}
}
query.add(api.fProgrammesPageSize,pageSize).add(api.mProgrammesDuration).add(api.mProgrammesAncestorTitles)
	.add(api.mProgrammesVersionsAvailability);

if (category.indexOf('-h')>=0) {
	console.log('Usage: '+process.argv[1]+' category service_type format|genre|search [PID|showall|upcoming]');
	console.log();
	console.log('Category defaults to '+defcat);
	console.log('Service_type defaults to '+service+' values radio|tv|both');
	console.log('Aggregation defaults to genre');
	console.log('PID defaults to all PIDS');
}
else {
	var path = domain+feed;

	make_request(host,path,api_key,query,function(obj){
		if (obj.nitro) {
			processResponse(obj);
		}
		else if (obj.fault) {
			logFault(obj);
		}
		else {
			console.log(obj);
		}
		return [];
	});
}

process.on('exit', function(code) {
  pc_dump(pid);
});