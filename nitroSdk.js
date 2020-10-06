/*

Nitro SDK (can also be used with other recent BBC APIs)

*/

var http = require('http');
var https = require('https');
var url = require('url');
var util = require('util');

var debuglog = util.debuglog('bbc');

var api = require('./nitroApi/api.js');

String.prototype.toCamelCase = function camelize() {
	return this.toLowerCase().replace(/[-_ \/\.](.)/g, function(match, group1) {
		return group1.toUpperCase();
    });
}

var httpAgent;
var httpsAgent;
var dest = {};
var rateLimitEvents = 0;
var inFlight = 0;
var stacked = 0;

function query() {
	this.querystring = '';
	this.add = function(param,value,previous) {
		this.querystring += (this.querystring || previous===true ? '&' : '?')+param;
		if (value) this.querystring += '=' + encodeURIComponent(value);
		return this;
	};
	this.reset = function() {
		this.querystring = '';
		return this;
	};
	this.clone = function() {
		var newQ = new query();
		newQ.querystring = this.querystring;
		return newQ;
	}
	this.toString = function() {
		return this.querystring;
	}
	this.fromString = function(s,previous) {
		this.reset();
		s = s.split('?').pop();
		var e = s.split('&');
		for (var p of e) {
			var c = p.split('=');
			this.add(c[0],decodeURIComponent(c[1]),previous);
			previous = false;
		}
		return this;
	}
}

function nitroRawEpisode(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/episodes/'+pid;
}

function nitroRawEpisodeGenreGroups(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/episodes/'+pid+'/genre_groups';
}

function nitroRawEpisodeFormats(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/episodes/'+pid+'/formats';
}

function nitroRawEpisodeAncestors(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/episodes/'+pid+'/ancestors';
}

function nitroRawMasterBrand(mbid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/master_brands/'+mbid;
}

function nitroRawBrand(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/brands/'+pid;
}

function nitroRawBrandFranchises(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/brands/'+pid+'/franchises';
}

function nitroRawPromotion(pid, version) {
	if (!version) version = 1;
	return '/nitro/api/v'+version+'/promotions/'+pid;
}

function hasHeader(header, headers) {
	// snaffled from request module
	var headers = Object.keys(headers || this.headers),
		lheaders = headers.map(function (h) {return h.toLowerCase();});
	header = header.toLowerCase();
	for (var i=0;i<lheaders.length;i++) {
		if (lheaders[i] === header) return headers[i];
	}
	return false;
}

function makeRequest(host,path,key,query,settings,callback,err){
	inFlight++;
	debuglog(host+path+(key ? '?K' : '')+query.querystring);

	var defaults = {
		headers: {
			Accept: 'application/json',
			User_Agent: 'BBCiPlayerRadio/1.6.1.1522345 (SM-N900; Android 4.4.2)',
		},
		api_key_name: 'api_key',
		proto: 'http',
		port: null,
		backoff : 31000,
		timeout : 120000,
		payload: {}
	}

	settings = Object.assign({},defaults,settings); // merge/extend

	var qs = query.querystring;
	if (key) {
		qs = '?' + settings.api_key_name + '=' + encodeURIComponent(key) + qs;
	}

	var options = {
	  hostname: host,
	  port: settings.port ? settings.port : (settings.proto == 'http' ? 80 : 443),
	  path: path+qs,
	  method: 'GET',
	  headers: settings.headers
	};
	var proto = (settings.proto == 'http' ? http : https);
	if (settings.proto == 'http') {
		if (!httpAgent) {
			httpAgent = new http.Agent({ keepAlive: true });
		}
		options.agent = httpAgent;
	}
	else {
		if (!httpsAgent) {
			httpsAgent = new https.Agent({ keepAlive: true });
		}
		options.agent = httpsAgent;
	}

	var list = '';
	var obj;
	var json = (settings.headers.Accept == 'application/json');

	var req = proto.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		   list += data;
	  });
	  res.on('end', function() {
		inFlight--;
		if (res.statusCode >= 300 && res.statusCode < 400 && hasHeader('location', res.headers)) {
			// handle redirects, as per request module
			var location = res.headers[hasHeader('location', res.headers)];
			var locUrl = url.parse(location);
			host = locUrl.host;
			path = locUrl.pathname;
			makeRequest(host,path,key,query,settings,callback,err);
		}
		else if (res.statusCode >= 400 && res.statusCode < 600) {
			if (list) {
				try {
					if (json) {
						obj = JSON.parse(list);
					}
					else {
						obj = list;
					}

					if (typeof err !== 'undefined') err(res.statusCode,obj,settings.payload);

					if (json && obj.fault) {
						// process Apigee rate-limiting
						if (obj.fault.detail && obj.fault.detail.errorcode) {
							if (obj.fault.detail.errorcode == 'policies.ratelimit.QuotaViolation') {
								rateLimitEvents++;
								// rate limiting, back off by configured amount
								stacked++;
								setTimeout(function(){
									stacked--;
									makeRequest(host,path,key,query,settings,callback)
								},settings.backoff);
							}
							else {
								log_fault(obj,res,query); // rate limits leak keys in error messages
							}
						}
					}
					else if (json && obj.errors) {
						log_error(obj,res,query);
					}
					else {
						log_error(null,res,query);
					}
				}
				catch (e) {
					if (typeof err !== 'undefined') err(res.statusCode,list,settings.payload);
					console.warn(e);
					console.warn('Invalid JSON received:');
					console.warn(list);
				}
			}
			else {
				if (typeof err !== 'undefined') err(res.statusCode,null,settings.payload);
				log_error(null,res,query);
			}
		}
		else try {
			if (json) {
				obj = JSON.parse(list);
			}
			else {
				obj = list;
			}
			var result = callback(obj,settings.payload);
			if (dest.callback) {
				// call the callback's next required destination
				// e.g. second and subsequent pages
				if (dest.path) {
					makeRequest(host,dest.path,key,dest.query,settings,dest.callback,dest.err);
				}
				else {
					dest.callback({},settings.payload);
				}
			}
		}
		catch (e) {
			console.warn('Something went wrong parsing the response JSON');
			console.warn(e);
			console.warn(res.statusCode+' '+res.statusMessage);
			console.warn(res.headers);
			debuglog('** '+list);
		}
	   });
	}).setTimeout(settings.timeout);
	req.on('error', function(e) {
		if (typeof err !== 'undefined') err(500,e.message + ' ' +list,settings.payload)
		else console.warn(host+path,e.message);
	});
	req.end();
}

function log_fault(fault,res,query) {
	/*
	{ "fault": {
		"faultstring": "Rate limit quota violation. Quota limit : 0 exceeded by 1. Total violation count : 1. Identifier : YOUR-API-KEY-HERE",
		"detail":
			{"errorcode": “policies.ratelimit.QuotaViolation"}
		}
	}
	*/
	if (res) console.warn('Fault: '+res.statusCode+' '+res.statusMessage);
	if (query && query.toString()) console.warn(query.querystring);
	if (fault) console.warn(fault.fault.detail.errorcode+': '+fault.fault.faultstring);
}

function log_error(error,res,query) {
	/*
	{"errors":{"error":{"code":"XDMP-EXTIME","message":"Time limit exceeded"}}}
	*/
	if (res) console.warn('Error: '+res.statusCode+' '+res.statusMessage);
	if (query && query.toString()) console.warn(query.querystring);
	if (error) console.warn(error.errors.error.code+': '+error.errors.error.message);
}

module.exports = {

	setReturn : function(destination) {
		dest = destination;
	},

	getReturn : function(){
		return dest;
	},

	logFault : function(fault,res,query) {
		log_fault(fault,res,query);
	},

	logError : function(error,res,query) {
		log_error(error,res,query);
	},

	hasHeader : hasHeader,

	make_request : function(host,path,key,query,settings,callback,err) {
		makeRequest(host,path,key,query,settings,callback,err);
	},

	ping : function(host,key,settings,callback) {
		var q = new query();
		q.add(api.fMasterbrandsPageSize,1,true);
		makeRequest(host,api.nitroMasterbrands,key,q,settings,callback);
	},

	getRateLimitEvents : function() {
		return rateLimitEvents;
	},

	resetRateLimitEvents : function() {
		rateLimitEvents = 0;
	},

	getRequests : function() {
		return inFlight+stacked;
	},

	newQuery : function(param,value,previous) {
		q = new query();
		if (param) q.add(param,value,previous);
		return q;
	},

	queryFrom : function(url,previous) {
		q = new query();
		if (url.indexOf('?')>=0) {
			url = url.split('?')[1];
		}
		else if (url.indexOf('&')>=0) {
			url = url.split('&')[1];
		}
		q.querystring = ((previous ? '&' : '?')+url);
		return q;
	},

	iso8601durationToSeconds : function(input) {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0, totalseconds;

		if (reptms.test(input)) {
			var matches = reptms.exec(input);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
			totalseconds = hours * 3600 + minutes * 60 + seconds;
		}
		return totalseconds;
	},

	nitroRawEpisode : nitroRawEpisode,

	nitroRawEpisodeGenreGroups : nitroRawEpisodeGenreGroups,

	nitroRawEpisodeFormats : nitroRawEpisodeFormats,

	nitroRawEpisodeAncestors : nitroRawEpisodeAncestors,

	nitroRawMasterBrand : nitroRawMasterBrand,

	nitroRawBrand : nitroRawBrand,

	nitroRawBrandFranchises : nitroRawBrandFranchises,

	nitroRawPromotion : nitroRawPromotion

}
