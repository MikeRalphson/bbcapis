/*

List programmes by aggregation (category, format, or search)

*/

var http = require('http');
var fs = require('fs');
var util = require('util');
var common = require('./common');
var helper = require('./apiHelper');
var api = require('./nitroApi/api');

var programme_cache = [];
var download_history = [];
const host = 'nitro.stage.api.bbci.co.uk';
const domain = '/nitro';
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

/*
Examples include:

<feed name="Programmes" rel="feed" href="/nitro/api/programmes"
title="Start here for programmes metadata: Brands, Series, Episodes and Clips" release_status="supported">


<filter name="duration" type="string" title="filter for subset of programmes that have given duration"
release_status="supported">

<option value="short" title="filter for programmes that have short duration (< 5m)"
href="/nitro/api/programmes?duration=short" />

<sort name="views" is_default="false" title="sort numerically by number of views (most popular first - faster most_popular)"
 release_status="supported">

<sort_direction name="sort_direction" value="ascending" is_default="false"
 href="/nitro/api/programmes?sort=views&sort_direction=ascending" />

<n:mixin name="people" title="mixin to return information about contributors to a programme"
release_status="deprecated" deprecated="true" deprecated_since="2014-05-02"
replaced_by="contributions" href="/nitro/api/programmes?mixin=people"/>

Most important to notice here are the hrefs: these are links that go directly to the feed with those
filters/sorts/mixins applied. (You should follow the hrefs where possible, as we reserve the right
to change parameter URIs in future.) As you go deeper into the feeds, you'll see that the number of
available filters and sorts reduces to only show those that are relevant as further filters on the
current set of results. This makes it very easy to build up the query you're looking for.

*/

function processResponse(obj) {
	var nextHref = '';
	if (obj.nitro.pagination) {
		nextHref = obj.nitro.pagination.next.href;
	}
	morePages = false;
	page = obj.nitro.results.page;
	top = obj.nitro.results.total;
	if (!top) {
		top = obj.nitro.results.more_than+1;
	}
	console.log('page '+page+' of '+top);
	
	if (obj.nitro.results.programme.length===0) {
		console.log(obj);
	}
	else {
		for (var i in obj.nitro.results.programme) {
			title = obj.nitro.results.programme[i];
			p = title.programme;
			debuglog(p);
			if ((p.type == 'episode') || (p.type == 'clip'))  {
				add_programme(p);
			}
			else if ((p.type == 'series') || (p.type == 'brand')) {
				path = domain+page;
				query = newQuery(fProgrammesDescendantsOf,p.pid,true)
					.add(api.fProgrammesAvailabilityAvailable)
					.add(api.fProgrammesMediaSet,'pc')
					.add(api.fProgrammesPageSize,300);

				if (media_type) {
					query.add(api.fProgrammesMediaType,media_type);
				}
				make_request(host,path,api_key,query,this);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}
	if (page<top) {
		dest = {};
		dest.path = domain+page;
		dest.query = helper.queryFrom(nextHref,true);
		dest.callback = this;
	}
	// if we need to go somewhere else, e.g. after all pages received set callback and/or query
	return [];
}

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
		p = programme_cache[i];
		if (download_history.indexOf(p.pid) == -1) {
			title = (p.display_title ? p.display_title.title+
				(p.display_title.subtitle ? '/' : '')+p.display_title.subtitle : p.title);

			position = p.position ? p.position : 1;
			totaleps = 1;
			series = 1;
			parents = '';

			ownership = p.ownership;

			subp = p;
			while ((subp.programme) || (subp.parent)) {
				newp = subp.programme;
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

			console.log(p.pid+' '+p.type+' '+(ownership && ownership.service && ownership.service.type ?
			  ownership.service.type : service)+' '+
			  ((p.is_available===false||p.is_available_mediaset_pc_sd===false) ? 'Unavailable' : 'Available')+
			  '  '+title);

			len = p.duration ? p.duration : 0;
			if (p.versions) {
				if (!len && (p.versions[0].duration)) {
					len = p.versions[0].duration;
				}
				for (var v in p.versions) {
					parents += (parents ? '\n' : '')+'  vPID= '+p.versions[v].pid+' ('+p.versions[v].types[0]+')';
				}
			}

			suffix = 's';
			if (len>=60) {
				len = Math.floor(len/60);
				suffix = 'm';
			}
			if (len>=100) {
				len = Math.round(len/60);
				suffix = 'h';
			}

			console.log('  '+len+suffix+' S'+pad(series,'00')+'E'+pad(position,'00')+
				'/'+pad(totaleps,'00')+' '+(p.synopses.short ? p.synopses.shortS : 'No description'));
			if (parents) console.log(parents);

		}
		else {
			//console.log('Hidden '+p.pid);
			hidden++;
		}
	}
	console.log();
	console.log('Cache has '+programme_cache.length+' entries, '+hidden+' hidden');
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

/*
Once you have the feed, there are four tools for getting what you want:

Tool

Description


Filter
 Filters let you narrow down the request and are the core function of Nitro. To use a feed, you will virtually
 always have to filter it. (Generally speaking, performance improves as you add filters and narrow down the
 amount of data Nitro has to process. In broadcasts especially, providing a date range filter can dramatically
 improve speed.)
Sort
 Sorts order the data, including by properties calculated by Nitro, such as the view counts used to drive the
 "most_popular" sort of programmes.
Mixin
 Mixins allow you to specify optional elements you would like included in the output, on the understanding that
 they will impact performance (but save you making additional Nitro calls). For instance, the ancestor_titles
 mixin exposes all the titles and pids of the ancestors of a given object.
Pagination
 Nitro output is paginated. You can request how many items you want returned, but Nitro does not guarantee to
 honour this, only to return as many as possible. The results expose the page size. A page size of 0 is a special
 case that only returns you a count of the objects matching your filters.

*/

function make_request(host,path,key,query,callback) {
	console.log(host+path+'?K'+query.querystring);
	var options = {
	  hostname: host
	  ,port: 80
	  ,path: path+'?api_key='+key+query.querystring
	  ,method: 'GET'
	  ,headers: { 'Content-Type': 'application/json' }
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
			path = location.split('.co.uk')[1];
			host = location.split('://')[1].split('/')[0];
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
			destination = callback(obj);
		    if (destination.callback) {
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

/*
The starting point for using Nitro is always to work out what type of thing you're trying to find.
That determines which feed you use:

Programmes Find and navigate brands, series, episodes and clips
 /nitro/api/programmes
Schedules Dates, Times, Schedules: when and where are programmes being shown?
 /nitro/api/schedules
Versions Helps you handle the editorial "versions" of episodes (eg signed, cut for language, regional variations, etc)
 /nitro/api/versions
Services Exposes both live and historical BBC services, across TV and Radio.
 /nitro/api/services
People Find the People PIPs knows about: casts, crews, contributors, guests, artists, singers, bands ...
 /nitro/api/people
Items Step inside programmes to find tracklists, chapters, segments, songs, highlights and more
 /nitro/api/items
Availabilities For advanced users only: get specific details around when programmes and clips are available to play
 /nitro/api/availabilities
Images Find images, particularly those in galleries
 /nitro/api/images
Promotions Details of short-term editorially curated "promotions", for instance those programmes featured on iPlayer today
 /nitro/api/promotions
Groups Long-lived collections of programmes and more, including Collections, Seasons and Galleries
 /nitro/api/groups

*/

// https://developer.bbc.co.uk/nitropubliclicence

// http://downloads.bbc.co.uk/rmhttp/academy/collegeoftechnology/docs/j000m977x/Nitro_API.pdf

// see also https://github.com/mbst/glycerin
// https://admin.live.bbc.co.uk/nitro/admin/servicestatus
// https://api.live.bbc.co.uk/nitro/api/schema
// https://confluence.dev.bbc.co.uk/display/nitro/Nitro+run+book

var configstr = fs.readFileSync('./config.json', 'utf8');
var config = JSON.parse(configstr);
download_history = common.downloadHistory(config.download_history);
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
		media_type = 'audio-video';
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
	query.add(api.fProgrammesPid,pid).add(api.mProgrammesAncestorTitles)
		.add(api.mProgrammesContributions).add(api.mProgrammesVersionsAvailability);
	//add.(api.mProgrammesDuration) //?
}
else {
	query.add(api.fProgrammesAvailabilityAvailable)
		.add(api.fProgrammesMediaSet,'pc');
	if (media_type) {
		query.add(api.fProgrammesMediaType,media_type);
	}
}
query.add(api.fProgrammesPageSize,300);

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

	//http://nitro.stage.api.bbci.co.uk/nitro/api/
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