/*

List programmes by aggregation (category, format, or search)

*/
'use strict';

var fs = require('fs');
var util = require('util');
var url = require('url');
var getopt = require('node-getopt');
var common = require('./common');
var nitro = require('./nitroCommon');
var helper = require('./apiHelper');
var api = require('./nitroApi/api');

var programme_cache = [];
var download_history = [];
var showAll = false;
var dumpMediaSets = false;

// bbc seem to use int(ernal),test,stage and live

// http://nitro.api.bbci.co.uk
// http://nitro.stage.api.bbci.co.uk/nitro/api/
// http://d.bbc.co.uk/nitro/api/
// http://d.bbc.co.uk/stage/nitro/api/
// https://api.live.bbc.co.uk/nitro/api/
// https://api.test.bbc.co.uk/nitro/api/
// http://nitro-e2e.api.bbci.co.uk/nitro-e2e/api/
// http://nitro-slave-1.cloud.bbc.co.uk/nitro/api

var host = 'd.bbc.co.uk';
var domain = '/nitro/api';
var feed = '/programmes';
var mediaSet = 'pc';
var api_key = '';

var service = 'radio';
var media_type = 'audio';
const pageSize = 30;

var debuglog = util.debuglog('bbc');

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
		if (p.version && p.version.pid) {
			parents += '  ' + p.version.pid + ' (vPID)';
		}

		var available = (p.versions.available > 0);

		if  ((!present && available) || (programme_cache.length==1) || showAll) {

			if (programme_cache.length==1) {
				debuglog(p);
			}

			var position = p.episode_of ? p.episode_of.position : 1;
			var totaleps = 1;
			var series = 1;

			console.log(p.pid+' '+pad(p.item_type,'       ',true)+' '+p.media_type+' '+(available ? 'Available' : 'Unavailable')+'  '+title);

			var len = (p.version && p.version.duration) ? p.version.duration : '0s';
			len = len.replace('PT','').toLocaleLowerCase(); // ISO 8601 duration

			if (dumpMediaSets) {
				for (var v in p.versions.version) {
					debuglog(p.versions.version[v]);
					for (var va in p.versions.version[v].availabilities) {
						var a = p.versions.version[v].availabilities[va];
						// dump mediasets
						for (var vaa in a) {
							var vaaa = a[vaa];
							for (var ms in vaaa.media_sets.media_set) {
								console.log(vaaa.media_sets.media_set[ms]);
							}
						}
					}
				}
			}

			console.log('  '+len+' S'+pad(series,'00')+'E'+pad(position,'00')+
				'/'+pad(totaleps,'00')+' '+(p.synopses.short ? p.synopses.short : 'No description'));
			if (parents) console.log(parents);
			if (p.master_brand) {
				console.log('  '+p.master_brand.mid+' @ '+(p.release_date ? p.release_date : p.release_year));
			}
			if (p.version && p.version.start_time) {
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
					.add(api.fProgrammesAvailabilityTypeOndemand)
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
				nitro.make_request(host,path,api_key,query,{},processResponse);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}

	var dest = {};
	if (pageNo<last) {
		dest.path = domain+feed;
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = processResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	nitro.setReturn(dest);
	return true;
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
	var query = helper.newQuery();
	query.add(api.fProgrammesPageSize,pageSize,true)
		.add(api.mProgrammesContributions)
		.add(api.mProgrammesDuration)
		.add(api.mProgrammesAncestorTitles)
		.add(api.mProgrammesVersionsAvailability);
	for (var p in pidList) {
		pid = pidList[p].split('#')[0].trim();
		var pQuery = query.clone();
		pQuery.add(api.fProgrammesPid,pid);
		nitro.make_request(host,path,api_key,pQuery,{},function(obj){
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
			p.media_type = (item.service.sid.indexOf('radio')>=0 ? 'Audio' : 'Video');

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

	var dest = {};
	if (pageNo<last) {
		dest.path = '/nitro/api/schedules';
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = scheduleResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	nitro.setReturn(dest);
	return true;
}

//_____________________________________________________________________________
function processSchedule(host,api_key,category,mode) {
	var path = '/nitro/api/schedules';

	var today = new Date();
	var todayStr = today.toISOString();

	var query = helper.newQuery();
	query.add(api.fSchedulesStartFrom,todayStr,true);

	if (mode == 'genre') {
		query.add(api.fSchedulesGenre,category);
	}
	if (mode == 'format') {
		query.add(api.fSchedulesFormat,category);
	}
	if (mode == 'search') {
		query.add(api.fSchedulesQ,category);
	}

	query.add(api.mSchedulesAncestorTitles)
		.add(api.fSchedulesPageSize,pageSize);

	nitro.make_request(host,path,api_key,query,{},function(obj){
		var result = scheduleResponse(obj);
		var dest = nitro.getReturn();
		if (dest.callback) {
			// call the callback's next required destination
			// e.g. second and subsequent pages
			if (dest.path) {
				nitro.make_request(host,dest.path,api_key,dest.query,{},dest.callback);
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
var defcat = config.nitro.category;

var category = defcat;

var query = helper.newQuery();
var pid = '';
var mode = '';
var pending = false;
var path = domain+feed;

var options = getopt.create([
	['h','help','display this help'],
	['f','format=ARG','Set category type=format and format=ARG'],
	['g','genre=ARG','Set category type=genre and genre=ARG'],
	['s','search=ARG','Search metadata. Can use title: or synopses: prefix'],
	['d','domain=ARG','Set domain = radio,tv or both'],
	['i','imminent','Set availability to pending (default is available)'],
	['u','upcoming','Show programme schedule information not history'],
	['p','pid=ARG+','Query by individual pid(s), ignores options above'],
	['a','all','Show programme regardless of presence in download_history'],
	['m','mediaset','Dump mediaset information, most useful with -p']
]);
options.bindHelp();

query.add(api.fProgrammesMediaSet,mediaSet,true);

options.on('all',function(){
	showAll = true;
});
options.on('imminent',function(){
	pending = true;
});
options.on('domain',function(argv,options){
	service = options.domain;
	if (service == 'tv') {
		media_type = 'audio_video';
	}
	else if (service == 'both') {
		media_type = '';
	}
});
options.on('pid',function(argv,options){
	mode = 'pid';
	for (var p in options.pid) {
		processPid(host,path,api_key,options.pid[p]);
	}
});
options.on('upcoming',function(){
	feed = 'schedules';
});
options.on('search',function(argv,options){
	category = options.search;
	mode = 'search';
	query.add(api.fProgrammesQ,category,true).add(api.sProgrammesTitleAscending);
});
options.on('format',function(argv,options){
	category = options.format;
	mode = 'format';
	query.add(api.fProgrammesFormat,category);
});
options.on('genre',function(argv,options){
	category = options.genre;
	mode = 'genre';
	query.add(api.fProgrammesGenre,category);
});
options.on('mediaset',function(){
	dumpMediaSets = true;
});
var o = options.parseSystem();

if (pending) {
	query.add(api.fProgrammesAvailabilityPending);
}
else {
	query.add(api.fProgrammesAvailabilityAvailable);
}
if (media_type) {
	query.add(api.fProgrammesMediaType,media_type);
}

query.add(api.mProgrammesAvailability)
	.add(api.fProgrammesEntityTypeEpisode)
	.add(api.mProgrammesDuration)
	.add(api.mProgrammesAncestorTitles)
	.add(api.mProgrammesVersionsAvailability)
	.add(api.fProgrammesPageSize,pageSize)
	.add(api.fProgrammesAvailabilityTypeOndemand);

if (mode=='') {
	mode = 'genre';
	query.add(api.fProgrammesGenre,category);
}

if (feed == 'schedules') {
	processSchedule(host,api_key,category,mode);
}
else {
	if (mode=='search' || mode=='genre' || mode=='format') {
		nitro.make_request(host,path,api_key,query,{},function(obj){
			return dispatch(obj);
		});
	}
}

process.on('exit', function(code) {
  pc_dump(pid);
});