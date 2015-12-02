/*

List programmes by aggregation (category, format, or search)

*/
//'use strict';

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

// http://nitro.stage.api.bbci.co.uk/nitro/api/
//	now getting Unable to identify proxy for host: nitro and url: /nitro/stage/api/programmes
// http://nitro.api.bbci.co.uk/nitro/api?api_key=q5wcnsqvnacnhjap7gzts9y6
// http://d.bbc.co.uk/nitro/api/
// http://d.bbc.co.uk/stage/nitro/api/
// https://api.live.bbc.co.uk/nitro/api/schedules

var host = 'd.bbc.co.uk';
var domain = '/nitro';

var page = '/api/programmes';
var api_key = '';
var service = 'radio';
var media_type = 'audio';

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
		if (download_history.indexOf(p.pid) == -1) {

			if (programme_cache.length==1) {
				console.log(p);
			}

			var title = (p.title ? p.title : p.presentation_title);
			for (var at in p.ancestor_titles) {
				title = p.ancestor_titles[at].title + ' / ' + title;
			}

			var position = p.episode_of ? p.episode_of.position : 1;
			var totaleps = 1;
			var series = 1;
			var parents = '';

			var ownership = p.ownership;

			var subp = p;
			while ((subp.programme) || (subp.parent)) {
				var newp = subp.programme;
				if (!newp) newp = subp.parent.programme;
				subp = newp;
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

			console.log(p.pid+' '+p.item_type+' '+(ownership && ownership.service && ownership.service.type ?
			  ownership.service.type : service)+' '+
			  ((p.is_available===false||p.is_available_mediaset_pc_sd===false) ? 'Unavailable' : 'Available')+
			  '  '+title);

			var len = (p.version && p.version.duration) ? p.version.duration : '0';
			//if (p.versions) {
			//	for (var v in p.versions.version) {
			//		console.log(p.versions.version[v]);
			//	}
			//}
			len = len.replace('PT','');
			var suffix = '';

			console.log('  '+len+suffix+' S'+pad(series,'00')+'E'+pad(position,'00')+
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
	if (obj.nitro.pagination) {
		nextHref = obj.nitro.pagination.next.href;
	}
	var morePages = false;
	var pageNo = obj.nitro.results.page;
	var top = obj.nitro.results.total;
	if (!top) {
		top = obj.nitro.results.more_than+1;
	}
	var last = Math.ceil(top/obj.nitro.results.page_size);
	//console.log('page '+pageNo+' of '+last);
	
	var length = 0;
	if (obj.nitro.results.items) {
		length = obj.nitro.results.items.length;
	}

	if (length==0) {
		console.log(obj);
	}
	else {
		for (var i in obj.nitro.results.items) {
			var p = obj.nitro.results.items[i];
			debuglog(p);
			if ((p.item_type == 'episode') || (p.item_type == 'clip'))  {
				add_programme(p);
			}
			else if ((p.item_type == 'series') || (p.item_type == 'brand')) {
				var path = domain+page;
				var query = helper.newQuery(api.fProgrammesDescendantsOf,p.pid,true)
					.add(api.fProgrammesAvailabilityAvailable)
					.add(api.fProgrammesMediaSet,'pc')
					.add(api.fProgrammesPageSize,300);

				if (media_type) {
					query.add(api.fProgrammesMediaType,media_type);
				}
				make_request(host,path,api_key,query,processResponse);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}

	var dest = {};
	// if we need to go somewhere else, e.g. after all pages received set callback and/or query
	if (pageNo<last) {
		dest.path = domain+page;
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = processResponse;
	}
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
			var destination = callback(obj);
		    if (destination && destination.callback) {
				// call the callback's next required destination
				// e.g. programme=pid getting a brand or series and calling children_of
				if (destination.path) {
					make_request(host,destination.path,key,destination.query,destination.callback);
				}
				else {
					destination.callback();
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

// http://downloads.bbc.co.uk/rmhttp/academy/collegeoftechnology/docs/j000m977x/Nitro_API.pdf

// see also https://github.com/mbst/glycerin
// https://admin.live.bbc.co.uk/nitro/admin/servicestatus
// https://api.live.bbc.co.uk/nitro/api/schema
// https://confluence.dev.bbc.co.uk/display/nitro/Nitro+run+book
// http://www.bbc.co.uk/academy/technology/article/art20141013145843465

var config = require('./config.json');
download_history = common.downloadHistory(config.download_history);
host = config.nitro.host;
api_key = config.nitro.api_key;

var defcat = 'drama/scifiandfantasy';
var category = defcat;
var query = helper.newQuery();
var pid = '';

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

query = helper.newQuery();
if (process.argv.length<6) {
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
}

if (process.argv.length>5) {
	pid = process.argv[5];
	query.add(api.fProgrammesPid,pid,true).add(api.mProgrammesContributions).add(api.mProgrammesVersionsAvailability);
}
else {
	query.add(api.fProgrammesAvailabilityAvailable)
		.add(api.fProgrammesMediaSet,'pc').add(api.fProgrammesEntityTypeEpisode);
	if (media_type) {
		query.add(api.fProgrammesMediaType,media_type);
	}
}
query.add(api.fProgrammesPageSize,300).add(api.mProgrammesDuration).add(api.mProgrammesAncestorTitles);

if (category.indexOf('-h')>=0) {
	console.log('Usage: '+process.argv[1]+' category service_type format|genre|search [PID]');
	console.log();
	console.log('Category defaults to '+defcat);
	console.log('Service_type defaults to '+service+' values radio|tv|both');
	console.log('Aggregation defaults to genre');
	console.log('PID defaults to all PIDS');
}
else {
	var path = domain+page;

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