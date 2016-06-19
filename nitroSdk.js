/*

Nitro SDK (can also be used with other recent BBC APIs)

*/

var http = require('http');
var https = require('https');
var util = require('util');

var debuglog = util.debuglog('bbc');

var api = require('./nitroApi/api.js');

String.prototype.toCamelCase = function camelize() {
	return this.toLowerCase().replace(/[-_ \/\.](.)/g, function(match, group1) {
		return group1.toUpperCase();
    });
}

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

function makeRequest(host,path,key,query,settings,callback){
	inFlight++;
	debuglog(host+path+(key ? '?K' : '')+query.querystring);

	var defaults = {
		Accept: 'application/json',
		User_Agent: 'BBCiPlayerRadio/1.6.1.1522345 (SM-N900; Android 4.4.2)',
		api_key_name: 'api_key',
		proto: 'http',
		port: 80,
		payload: {}
	}

	settings = Object.assign({},defaults,settings); // merge/extend

	var qs = query.querystring;
	if (key) {
		qs = '?' + settings.api_key_name + '=' + key + qs;
	}

	var options = {
	  hostname: host,
	  port: settings.port ? settings.port : (settings.proto == 'http' ? 80 : 443),
	  path: path+qs,
	  method: 'GET',
	  headers: { 'Accept': settings.Accept,
		'User-Agent': settings.User_Agent
	  }
	};

	var list = '';
	var obj;
	var json = (settings.Accept == 'application/json');
	var proto = (settings.proto == 'http' ? http : https);

	var req = proto.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		   list += data;
	  });
	  res.on('end', function() {
		if (res.statusCode >= 300 && res.statusCode < 400 && hasHeader('location', res.headers)) {
			inFlight--;
			// handle redirects, as per request module
			var location = res.headers[hasHeader('location', res.headers)];
			var locUrl = url.parse(location);
			path = locUrl.pathname;
			host = locUrl.host;
			make_request(host,path,key,query,settings,callback);
		}
		else if (res.statusCode >= 400 && res.statusCode < 600) {
			inFlight--;
			if (list) {
				try {
					if (json) {
						obj = JSON.parse(list);
					}
					else {
						obj = list;
					}
					if (json && obj.fault) {
						if (obj.fault.detail && obj.fault.detail.errorcode) {
							if (obj.fault.detail.errorcode == 'policies.ratelimit.QuotaViolation') {
								rateLimitEvents++;
								// rate limiting, back off by 45 seconds
								stacked++;
								setTimeout(function(){
									stacked--;
									makeRequest(host,path,key,query,settings,callback)
								},31000);
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
						console.log('Unknown response object');
						console.log(JSON.stringify(obj));
					}
				}
				catch (err) {
					console.log(err);
					console.log('Invalid JSON received:');
					console.log(list);
				}
			}
			else {
				log_fault(null,res,query);
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
			inFlight--;
			if (dest.callback) {
				// call the callback's next required destination
				// e.g. second and subsequent pages
				if (dest.path) {
					makeRequest(host,dest.path,key,dest.query,settings,dest.callback);
				}
				else {
					dest.callback({},settings.payload);
				}
			}
		}
		catch(err) {
			console.log('Something went wrong parsing the response JSON');
			console.log(err);
			console.log(res.statusCode+' '+res.statusMessage);
			console.log(res.headers);
			debuglog('** '+list);
		}
	   });
	});
	req.on('error', function(e) {
	  console.log('Problem with request: ' + e.message);
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
	if (res) console.log(res.statusCode+' '+res.statusMessage);
	if (query) console.log(query.querystring);
	if (fault) console.log(fault.fault.detail.errorcode+': '+fault.fault.faultstring);
}

function log_error(error,res,query) {
	/*
	{"errors":{"error":{"code":"XDMP-EXTIME","message":"Time limit exceeded"}}}
	*/
	if (res) console.log(res.statusCode+' '+res.statusMessage);
	if (query) console.log(query.querystring);
	if (error) console.log(error.errors.error.code+': '+error.errors.error.message);
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

	hasHeader : function (header, headers) {
		// snaffled from request module
		var headers = Object.keys(headers || this.headers),
			lheaders = headers.map(function (h) {return h.toLowerCase();});
		header = header.toLowerCase();
		for (var i=0;i<lheaders.length;i++) {
			if (lheaders[i] === header) return headers[i];
		}
		return false;
	},

	make_request : function(host,path,key,query,settings,callback) {
		makeRequest(host,path,key,query,settings,callback);
	},

	ping : function(host,key,settings,callback) {
		var q = new query();
		makeRequest(host,nitroRawMasterBrand('bbc_radio_four'),key,q,settings,callback);
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