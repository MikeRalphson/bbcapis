/*

List programmes by aggregation (category, format, or search)

*/

var http = require('http');
var fs = require('fs');
var util = require('util');
var common = require('./common');
var api = require('./nitroApi');

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
}

//-----------------------------------------------------------------------------

function cat_slice_dump(obj) {
	console.log('* Category_slice dump');
	console.log(obj.category_slice.category.key+' = '+obj.category_slice.category.title);
	var len = obj.category_slice.programmes.length;
	//console.log('Contains '+len+' entries');
	for (var i in obj.category_slice.programmes) {
		p = obj.category_slice.programmes[i];
		if ((p.type == 'episode') || (p.type == 'clip'))  {
			//add_programme(p); //? not enough info available
			common.pid_list(p.type,p,true,add_programme);
		}
		else if ((p.type == 'series') || (p.type == 'brand')) {
			common.pid_list(p.type,p,false,add_programme);
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
	var len = obj.category_page.available_programmes.length;
	//console.log('Contains '+len+' entries');
	for (var i in obj.category_page.available_programmes) {
		p = obj.category_page.available_programmes[i];
		if ((p.type == 'episode') || (p.type == 'clip'))  {
			add_programme(p); //? faster than querying each PID
		}
		else if ((p.type == 'series') || (p.type == 'brand')) {
			common.pid_list(p.type,p,false,add_programme);
		}
		else {
			console.log('Unhandled type: '+p.type);
			console.log(p);
		}

	}
}

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

function atoz_list(obj) {
	console.log('Result page n of m');
	if (obj.programmes.tleo_titles.length==0) {
		console.log(obj);
	}
	else {
		for (var i in obj.programmes.tleo_titles) {
			title = obj.atoz.tleo_titles[i];
			p = title.programme;
			debuglog(p);
			if ((p.type == 'episode') || (p.type == 'clip'))  {
				add_programme(p);				
			}
			else if ((p.type == 'series') || (p.type == 'brand')) {
				path = domain+page;
				querystring = '&descendants_of='+p.pid+'&availability=available&mediaset=pc';
				if (media_type) {
					querystring +='&media_type='+media_type;
				}
				make_request(host,path,api_key,querystring,this);
			}
			else {
				console.log('Unhandled type: '+p.type);
				console.log(p);
			}
		}
	}
	// if we need to go somewhere after all pages received set callback and/or path+querystring
	// dest = [];
	// dest.path = domain+page;
	// dest.querystring = '...'
	// dest.callback = this; // or (inline) function
	return [];
}

//-----------------------------------------------------------------------------

function pad(str, pad, padRight) {
	if (typeof str === 'undefined')
		return pad;
	if (padRight) {
		return (str + pad).substring(0, pad.length);
	} else {
		return (pad + str).slice(-pad.length);
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
				for (var i in p.versions) {
					parents += (parents ? '\n' : '')+'  vPID= '+p.versions[i].pid+' ('+p.versions[i].types[0]+')';
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
				'/'+pad(totaleps,'00')+' '+(p.short_synopsis ? p.short_synopsis : 'No description'));
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
		lheaders = headers.map(function (h) {return h.toLowerCase()});
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

function make_request(host,path,key,querystring,callback) {
	console.log(host+path+'?K'+querystring);
	var options = {
	  hostname: host
	  ,port: 80
	  ,path: path+'?api_key='+key
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
			make_request(host,path,key,querystring,callback);
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
			//if (obj.pages...)
			//	if obj has more pages recurse and call callback again, before we then..
		    if (destination.callback) {
				// call the callback's next required destination
				// e.g. programme=pid getting a brand or series and calling children_of
				if (destination.path) {
					make_request(host,destination.path,key,destination.querystring,destination.callback);
				}
				else {
					destination.callback(); //pass the last page back in?
				}
			}
		}
		catch(err) {
			console.log('Something went wrong parsing the response JSON');
			console.log(err);
			console.log(res.statusCode+' '+res.statusMessage);
			console.log(res.headers);
			console.log('** '+list);
		};
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

// see also https://github.com/mbst/glycerin

var configstr = fs.readFileSync('./config.json', 'utf8');
var config = JSON.parse(configstr);
download_history = common.downloadHistory(config.download_history);
api_key = config.nitro.api_key;

var defcat = 'drama/scifiandfantasy';
var category = defcat;
var querystring = '';
var pid = '';

if (process.argv.length>2) {
	category = escape(process.argv[2]);
}

if (process.argv.length>3) {
	service = process.argv[3];
	if (service == 'tv') {
		media_type = 'audio-video';
	}
	else if (service_type == 'both') {
		media_type = '';
	}
}

if (process.argv.length>4) {
	if (process.argv[4] == 'search') {
		querystring = '&q=title:'+escape(category)+'&sort=title&sort_direction=ascending';
	}
	else if (process.argv[4] == 'format') {
		querystring = '&format='+category;
	}
	else {
		querystring = '&genre='+category;
	}
}

if (process.argv.length>5) {
	pid = process.argv[5];
}
else {
	querystring += '&availability=available&mediaset=pc';
	if (media_type) {
		querystring +='&media_type='+media_type;
	}
}

if (category.indexOf('-h')>=0) {
	console.log('Usage: '+process.argv[1]+' category service_type format|genre|search [PID]');
	console.log();
	console.log('Category defaults to '+defcat);
	console.log('Service_type defaults to '+service+' values radio|tv|both');
	console.log('Aggregation defaults to genre');
	console.log('PID defaults to all PIDS');
}
else {
	if (pid) {
		querystring = '&programme='+pid+'&mixin=ancestor_titles&mixin=contributions'; //mixin=duration ?
	}
	var path = domain+page;

	//http://nitro.stage.api.bbci.co.uk/nitro/api/
	make_request(host,path,api_key,querystring,function(obj){
		if (obj.programmes) {
			atoz_list(obj); //tleo_titles
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