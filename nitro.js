/*

List programmes by aggregation (category, format, or search)

*/
'use strict';

var fs = require('fs');
var util = require('util');
var url = require('url');

var getopt = require('node-getopt');
var j2x = require('jgexml/json2xml');

var giUtils = require('./giUtils');
var nitro = require('./nitroSdk');
var api = require('./nitroApi/api');

var red = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[31m';
var green = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[32m';
var normal = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[0m';

var programme_cache = [];
var download_history = [];
var showAll = false;
var dumpMediaSets = false;
var upcoming = false;
var pidList = [];
var indexBase = 10000;
var channel = '';
var partner_pid = '';
var sid = '';
var search = '';
var children = false;

// bbc seem to use int(ernal),test,stage and live

// http://programmes.api.bbc.com
// http://nitro.api.bbci.co.uk - deprecated since 24/12/2015
// http://nitro.stage.api.bbci.co.uk/nitro/api/
// http://d.bbc.co.uk/nitro/api/ - deprecated since 24/12/2015
// http://d.bbc.co.uk/stage/nitro/api/
// http://data.bbc.co.uk/nitro/api/ - deprecated since 24/12/2015

// https://api.live.bbc.co.uk/nitro/api/
// https://api.test.bbc.co.uk/nitro/api/
// http://nitro-e2e.api.bbci.co.uk/nitro-e2e/api/ - locked down?
// http://nitro-slave-1.cloud.bbc.co.uk/nitro/api

var host = 'programmes.api.bbc.com';
var domain = '/nitro/api';
var feed = '/programmes';
var mediaSet = 'pc';
var payment_type = 'free';
var api_key = '';

var service = 'radio';
var media_type = 'audio';
const pageSize = 30;

var debuglog = util.debuglog('bbc');

//----------------------------------------------------------------------------

var add_programme = function(obj,parent) {
	var seen = false;
	for (var i in programme_cache) {
		var check = programme_cache[i];
		if (check.pid == obj.pid) {
			seen = true;
			if (!check.x_parent.pid) check.x_parent = parent;
			break;
		}
	}
	if (!seen) {
		if (parent) {
			obj.x_parent = parent;
		}
		programme_cache.push(obj);
	}
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

function pc_export() {

var hidden = 0;

	console.log('\n* Programme Cache:');
	var index = indexBase;
	for (var i in programme_cache) {
		index++;
		var p = programme_cache[i];
		var present = giUtils.binarySearch(download_history,p.pid)>=0;
		var title = p.title;
		var subtitle = (p.display_titles && p.display_titles.subtitle ? p.display_titles.subtitle : p.presentation_title);
		var available = ((p.available_versions) && (p.available_versions.available > 0));
		var position = p.episode_of ? p.episode_of.position : 1;
		var totaleps = 1;
		var series = 1;
		var len = (p.version && p.version.duration) ? nitro.iso8601durationToSeconds(p.version.duration) : '0';

		var thumb = p.image.template_url.replace('$recipe','150x84');

//#index|type|name|pid|available|episode|seriesnum|episodenum|versions|duration|desc|channel|categories|thumbnail|timeadded|guidance|web

		if (i==programme_cache.length-1) {
			debuglog(JSON.stringify(p,null,2));
		}

		console.log(index+'|'+(p.media_type == 'Video' ? 'tv' : 'radio')+'|'+title+'|'+p.pid+'|'+
			(available ? 'Available' : 'Unavailable')+'|'+subtitle+'|'+'|'+series+'|'+position+'|'+'default'+'|'+
			len+'||'+(p.master_brand ? p.master_brand.mid : 'unknown')+'|'+category[0]+'|'+thumb+'|'+Math.floor(Date.now()/1000)+
			'||'+'http://bbc.co.uk/programmes/'+p.pid+'|');
	}
}

//-----------------------------------------------------------------------------

function pc_dump() {

var hidden = 0;

	console.log('\n* Programme Cache:');
	for (var i in programme_cache) {
		var p = programme_cache[i];

		var present = giUtils.binarySearch(download_history,p.pid)>=0;

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

		var available = ((p.available_versions) && (p.available_versions.available > 0));

		if  ((!present && available) || (pidList.indexOf(p.pid)>=0) || showAll) {

			if (programme_cache.length==1) {
				debuglog(JSON.stringify(p,null,2));
			}

			var position = p.episode_of ? p.episode_of.position : 1;
			var totaleps = p.x_parent && p.x_parent.expected_child_count ? p.x_parent.expected_child_count : 1;
			var series = 1;

			console.log(p.pid+' '+pad(p.item_type,'       ',true)+' '+
				(p.media_type ? p.media_type : 'Audio')+' '+(available ? 'Available' : 'Unavailable')+'  '+green+title+normal);

			var len = (p.version && p.version.duration) ? p.version.duration : '0s';

			for (var v in p.available_versions.version) {
			    var version = p.available_versions.version[v];
				if (len == '0s') {
					len = version.duration;
				}
				parents += '  ' + version.pid + ' (vPID '+version.types.type[0]+')';
				for (var va in p.available_versions.version[v].availabilities) {
					var a = p.available_versions.version[v].availabilities[va];
					// dump mediasets
					if (dumpMediaSets) {
						for (var vaa in a) {
							var vaaa = a[vaa];
							for (var ms in vaaa.media_sets.media_set) {
								console.log(p.available_versions.version[v].pid+' '+vaaa.status+' '+vaaa.media_sets.media_set[ms].name);
							}
						}
					}
				}
			}

			len = len.replace('PT','').toLocaleLowerCase(); // ISO 8601 duration

			console.log('  '+len+' S'+pad(series,'00')+'E'+pad(position,'00')+
				'/'+pad(totaleps,'00')+' '+(p.synopses && p.synopses.short ? p.synopses.short : 'No description'));
			if (parents) console.log(parents);
			if (p.master_brand) {
				console.log('  '+p.master_brand.mid+' @ '+(p.release_date ? p.release_date :
					(p.release_year ? p.release_year : p.updated_time)));
			}

			if (p.contributions) {
				console.log();
				for (var c in p.contributions.contribution) {
					var cont = p.contributions.contribution[c];
					console.log((cont.character_name ? cont.character_name : cont.credit_role.$)+' - '+
						(cont.contributor.name.given ? cont.contributor.name.given+' '+cont.contributor.name.family :
						cont.contributor.name.presentation));
				}
			}

			//if (p.x_parent) {
			//	console.log(JSON.stringify(p.x_parent,null,2));
			//}

		}
		else {
			hidden++;
		}
	}
	console.log();
	console.log('Cache has '+programme_cache.length+' entries, '+hidden+' hidden');
}

//_____________________________________________________________________________
var processResponse = function(obj,payload) {
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
		//console.log('No results returned');
	}
	else {
		for (var i in obj.nitro.results.items) {
			var p = obj.nitro.results.items[i];
			//debuglog(JSON.stringify(p,null,2));
			if ((p.item_type == 'episode') || (p.item_type == 'clip'))  {
				add_programme(p,payload);
			}
			else if ((p.item_type == 'series') || (p.item_type == 'brand')) {
				var path = domain+feed;
				var query = nitro.newQuery(api.fProgrammesDescendantsOf,p.pid,true)
					.add(api.fProgrammesAvailabilityAvailable)
					.add(api.fProgrammesAvailabilityEntityTypeEpisode)
					.add(api.fProgrammesAvailabilityTypeOndemand)
					.add(api.fProgrammesPaymentType,payment_type)
					.add(api.fProgrammesMediaSet,mediaSet)
					.add(api.mProgrammesDuration)
					.add(api.mProgrammesAncestorTitles)
					.add(api.mProgrammesAvailability)
					.add(api.mProgrammesAvailableVersions)
					.add(api.fProgrammesEntityTypeEpisode)
					.add(api.fProgrammesPageSize,pageSize);

				if (media_type) {
					query.add(api.fProgrammesMediaType,media_type);
				}
				process.stdout.write('>');
				var settings = {};
				settings.payload = p;
				nitro.make_request(host,path,api_key,query,settings,processResponse);
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
		dest.query = nitro.queryFrom(nextHref,true);
		dest.callback = processResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	nitro.setReturn(dest);
	return true;
}

//_____________________________________________________________________________
function dispatch(obj,payload) {
	if (obj.nitro) {
		processResponse(obj,payload);
	}
	else if (obj.fault) {
		nitro.logFault(obj);
	}
	else if (obj.errors) {
		nitro.logError(obj);
	}
	else {
		console.log(obj);
	}
	return {};
}

//_____________________________________________________________________________
function processPid(host,path,api_key,pid) {
	var query = nitro.newQuery();
	query.add(api.fProgrammesPageSize,pageSize,true)
		.add(api.mProgrammesContributions)
		.add(api.mProgrammesDuration)
		.add(api.mProgrammesAncestorTitles)
		.add(api.mProgrammesAvailableVersions)
		.add(api.mProgrammesGenreGroupings)

	if (upcoming || children) {
		query.add(api.fProgrammesChildrenOf,pid)
		.add(api.fProgrammesAvailabilityPending);
	}
	else {
		query.add(api.fProgrammesPid,pid)
	}
	if (partner_pid != '') {
		query.add(api.fProgrammesPartnerPid,partner_pid);
	}
	else {
		if (pending) {
			query.add(api.fProgrammesAvailability,'P7D');
		}
		else {
			query.add(api.fProgrammesAvailabilityAvailable);
		}
		query.add(api.mProgrammesAvailability); // has a dependency on 'availability'
	}
	nitro.make_request(host,path,api_key,query,{},function(obj){
		return dispatch(obj);
	});
}

//_____________________________________________________________________________
function processVpid(host,path,api_key,vpid) {
	var query = nitro.newQuery();
	query.add(api.fVersionsPid,vpid,true);
	if (partner_pid != '') {
		query.add(api.fVersionsPartnerPid,partner_pid);
	}
	else {
		if (pending) {
			query.add(api.fVersionsAvailability,'P7D');
		}
		else {
			query.add(api.fVersionsAvailabilityAvailable);
		}
	}
	nitro.make_request(host,api.nitroVersions,api_key,query,{},function(obj){
		for (var i in obj.nitro.results.items) {
			var item = obj.nitro.results.items[i];
			var pid = item.version_of.pid;
			processPid(host,path,api_key,pid)
		}
	});
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

			debuglog(item);

			// minimally convert a broadcast into a programme for display
			var p = {};
			p.ancestor_titles = item.ancestor_titles;
			p.available_versions = {};
			p.available_versions.available = 1;

			p.version = {};
			p.version.duration = (item.published_time ? item.published_time.duration : '');
			p.synopses = {};
			p.media_type = (item.service.sid.indexOf('radio')>=0 ? 'Audio' : 'Video');
			p.image = item.image;
			p.master_brand = {};
			p.master_brand.mid = item.service.sid; //!
			p.release_date = item.published_time.start;

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
		dest.query = nitro.queryFrom(nextHref,true);
		dest.callback = scheduleResponse;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or path
	nitro.setReturn(dest);
	return true;
}

//_____________________________________________________________________________
function processSchedule(host,api_key,category,format,mode,pid) {
	var path = '/nitro/api/schedules';

	var today = new Date();
	var todayStr = today.toISOString();

	var query = nitro.newQuery();
	query.add(api.fSchedulesStartFrom,todayStr,true);

	if (mode == 'genre') {
		for (var c in category) {
			query.add(api.fSchedulesGenre,category[c]);
		}
	}
	for (var f in format) {
		query.add(api.fSchedulesFormat,format[f]);
	}
	if (search != '') {
		query.add(api.fSchedulesQ,search);
	}
	if (mode == 'pid') {
		query.add(api.fSchedulesDescendantsOf,pid);
	}
	if (channel != '') {
		query.add(api.fSchedulesServiceMasterBrand,channel);
	}
	if (partner_pid) {
		query.add(api.fSchedulesPartnerPid,partner_pid);
	}
	if (sid) {
		query.add(api.fSchedulesSid,sid);
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

var defcat = 'all';

try {
	var config = require('./config.json');
	download_history = giUtils.downloadHistory(config.download_history);
	host = config.nitro.host;
	api_key = config.nitro.api_key;
	mediaSet = config.nitro.mediaset;
	defcat = config.nitro.category;
}
catch (e) {
	console.log('Please rename config.json.example to config.json and edit for your setup');
	process.exit(2);
}

var category = [];
var format = [];

var query = nitro.newQuery();
var pid = '';
var mode = '';
var pending = false;
var episode_type = '';
var duration = '';
var path = domain+feed;

var options = getopt.create([
	['h','help','display this help'],
	['b','index_base','get_iplayer index base, defaults to 10000'],
	['c','channel=ARG','Filter by channel (masterbrand) id'],
	['d','domain=ARG','Set domain = radio,tv or both'],
	['e','episode=ARG','Set programme type to episode* or clip'],
	['f','format=ARG+','Filter by format id'],
	['g','genre=ARG+','Filter by genre id. all to reset'],
	['l','linear=ARG','Set linear service id, works with -u only'],
	['r','run=ARG','run-length, short,medium or long'],
	['s','search=ARG','Search metadata. Can use title: or synopsis: prefix'],
	['t','payment_type=ARG','Set payment_type to free*,bbcstore,uscansvod'],
	['p','pid=ARG+','Query by individual pid(s), ignores options above'],
	['v','version=ARG+','Query by individual version pid(s), ignores options above'],
	['a','all','Show programme regardless of presence in download_history'],
	['i','imminent','Set availability to future (default is available)'],
	['k','children','Include children of given pid'],
	['m','mediaset','Dump mediaset information, most useful with -p'],
	['o','output','output in get_iplayer cache format'],
	['u','upcoming','Show programme schedule information not history'],
	['x','partner_pid=ARG','Set partner pid, defaults to s0000001']
]);
var o = options.bindHelp();

query.add(api.fProgrammesMediaSet,mediaSet,true);

options.on('all',function(){
	showAll = true;
});
options.on('imminent',function(){
	pending = true;
});
options.on('children',function(){
	children = true;
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
});
options.on('version',function(argv,options){
	mode = 'version';
});
options.on('upcoming',function(){
	feed = 'schedules';
	upcoming = true;
});
options.on('channel',function(argv,options){
	channel = options.channel;
	query.add(api.fProgrammesMasterBrand,channel).add(api.sProgrammesTitleAscending);
});
options.on('search',function(argv,options){
	search = options.search;
	query.add(api.fProgrammesQ,search).add(api.sProgrammesTitleAscending);
});
options.on('format',function(argv,options){
	format = options.format;
	for (var f in format) {
		query.add(api.fProgrammesFormat,format[f]);
	}
});
options.on('genre',function(argv,options){
	mode = 'genre';
	for (var g in options.genre) {
		var genre = options.genre[g];
		if (genre == 'all') {
			category = [];
		}
		else {
			category.push(genre);
			query.add(api.fProgrammesGenre,genre);
		}
	}
});
options.on('mediaset',function(){
	dumpMediaSets = true;
});
options.on('payment_type',function(argv,options){
	payment_type = options.payment_type;
});
options.on('partner_pid',function(argv,options){
	partner_pid = options.partner_pid;
});
options.on('linear',function(argv,options){
	sid = options.linear;
});
options.on('episode',function(argv,options){
	episode_type = options.episode;
});
options.on('run',function(argv,options){
	duration = options.run;
});
var o = options.parseSystem();

if (partner_pid) {
	query.add(api.fProgrammesPartnerPid,partner_pid)
		.add(api.mProgrammesAvailability)
		.add(api.mProgrammesAvailableVersions)
		.add(api.fProgrammesAvailabilityAvailable);
}
else {
	if (pending) {
		query.add(api.fProgrammesAvailability,'P7D');
	}
	else {
		query.add(api.fProgrammesAvailabilityAvailable);
	}
	query.add(api.mProgrammesAvailability)
		.add(api.mProgrammesAvailableVersions)
		.add(api.fProgrammesPaymentType,payment_type)
		.add(api.fProgrammesAvailabilityTypeOndemand);
}
if (episode_type == 'clip') {
	query.add(api.fProgrammesAvailabilityEntityTypeClip);
}
else {
	query.add(api.fProgrammesAvailabilityEntityTypeEpisode);
}
if (media_type) {
	query.add(api.fProgrammesMediaType,media_type);
}
if (duration) {
	query.add(api.fProgrammesDuration,duration);
}

	//.add(api.fProgrammesEntityTypeEpisode)
query.add(api.mProgrammesDuration)
	.add(api.mProgrammesAncestorTitles)
	.add(api.fProgrammesPageSize,pageSize);

if (mode=='') {
	mode = 'genre';
	category.push(defcat);
	query.add(api.fProgrammesGenre,defcat);
}

if (mode == 'version') {
	for (var p in o.options.version) {
		pid = o.options.version[p];
		if (pid.indexOf('@')==0) {
			pid = pid.substr(1);
			var s = fs.readFileSync(pid,'utf8');
			pidList = pidList.concat(s.split('\n'));
		}
		else {
			pidList.push(pid);
		}
	}
	for (var p in pidList) {
		processVpid(host,path,api_key,pidList[p]);
	}
}
else if (mode == 'pid') {
	for (var p in o.options.pid) {
		pid = o.options.pid[p];
		if (pid.indexOf('@')==0) {
			pid = pid.substr(1);
			var s = fs.readFileSync(pid,'utf8');
			pidList = pidList.concat(s.split('\n'));
		}
		else {
			pidList.push(pid);
		}
	}
	for (var p in pidList) {
		if (upcoming) {
			processSchedule(host,api_key,category,format,mode,pidList[p]);
		}
		else {
			processPid(host,path,api_key,pidList[p]);
		}
	}
}
else if (feed == 'schedules') {
	processSchedule(host,api_key,category,format,mode);
}
else {
	if (mode=='genre') {
		// parallelize the queries by 36 times
		var letters = '0123456789abcdefghijklmnopqrstuvwxyz';
		for (var l in letters) {
			if (letters.hasOwnProperty(l)) {
				var lQuery = query.clone();
				lQuery.add(api.fProgrammesInitialLetter,letters[l]);
				nitro.make_request(host,path,api_key,lQuery,{},function(obj,payload){
					return dispatch(obj,payload);
				});
			}
		}
	}
}

process.on('exit', function(code) {
	if (o.options.output) {
		pc_export();
	}
	else {
		pc_dump();
		if (nitro.getRateLimitEvents()>0) {
			console.log('Got '+nitro.getRateLimitEvents()+' rate-limit events');
		}
	}
});
