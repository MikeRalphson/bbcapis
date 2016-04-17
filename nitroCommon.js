/*

Routines common for Nitro (and other recent BBC APIs)

*/

var http = require('http');
//var https = require('https');
var util = require('util');

var debuglog = util.debuglog('bbc');

var dest = {};

function makeRequest(host,path,key,query,settings,callback){
	debuglog(host+path+(key ? '?K' : '')+query.querystring);

	var defaults = {
		Accept: 'application/json',
		User_Agent: 'BBCiPlayerRadio/1.6.1.1522345 (SM-N900; Android 4.4.2)',
		api_key_name: 'api_key'
	}

	settings = Object.assign({},defaults,settings); // merge/extend

	var qs = query.querystring;
	if (key) {
		qs = '?' + settings.api_key_name + '=' + key + qs;
	}

	var options = {
	  hostname: host,
	  port: 80,
	  path: path+qs,
	  method: 'GET',
	  headers: { 'Accept': settings.Accept,
		'User-Agent': settings.User_Agent
	  }
	};

	var list = '';
	var obj;
	var json = (settings.Accept == 'application/json');

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
			make_request(host,path,key,query,settings,callback);
		}
		else if (res.statusCode >= 400 && res.statusCode < 600) {
			console.log(res.statusCode+' '+res.statusMessage);
			console.log(query.queryString);
			if (list) {
				try {
					if (json) {
						obj = JSON.parse(list);
					}
					else {
						obj = list;
					}
					if (json && obj.fault) {
						log_fault(obj);
						if (fault.detail && fault.detail.errorcode) {
							if (fault.detail.errorcode == 'policies.ratelimit.QuotaViolation') {
								// rate limiting, back off by 45 seconds
								setTimeout(function(){
									make_request(host,path,key,query,settings,callback)
								},45000);
							}
						}
					}
					else if (json && obj.errors) {
						log_error(obj);
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
			if (json) {
				obj = JSON.parse(list);
			}
			else {
				obj = list;
			}
			var result = callback(obj);
			if (dest.callback) {
				// call the callback's next required destination
				// e.g. second and subsequent pages
				if (dest.path) {
					makeRequest(host,dest.path,key,dest.query,settings,dest.callback);
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

function log_fault(fault) {
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

function log_error(error) {
	/*
	{"errors":{"error":{"code":"XDMP-EXTIME","message":"Time limit exceeded"}}}
	*/
	console.log(error.errors.error.code+': '+error.errors.error.message);
}

module.exports = {

	setReturn : function(destination) {
		dest = destination;
	},

	getReturn : function(){
		return dest;
	},
	logFault : function(fault) {
		log_fault(fault);
	},
	logError : function(error) {
		log_error(error);
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

	iso8601durationToSeconds : function(input) {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0, totalseconds;

		if (reptms.test(input)) {
			var matches = reptms.exec(input);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
			totalseconds = hours * 3600  + minutes * 60 + seconds;
		}
		return totalseconds;
	},

	make_request : function(host,path,key,query,accept,callback) {
		makeRequest(host,path,key,query,accept,callback);
	}

}
