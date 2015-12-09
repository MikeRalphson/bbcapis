'use strict';

var http = require('http');
var fs = require('fs');

var helper = require('./apiHelper');

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

//_____________________________________________________________________________
function make_request(host,path,key,query,accept,callback) {
	//console.log(host+path+(key ? '?K' : '')+query.querystring);

	var qs = query.querystring;
	if (key) {
		qs = '?api_key=' + key + qs;
	}

	var options = {
	  hostname: host
	  ,port: 80
	  ,path: path+qs
	  ,method: 'GET'
	  ,headers: {'Accept': accept,
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
			var destination;
			if (accept=='application/json') {
				obj = JSON.parse(list);
				destination = callback(obj);
			}
			else {
				destination = callback(list);
			}
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

//_____________________________________________________________________________

var config = require('./config.json');
var api_key = config.nitro.api_key;
var host = config.nitro.host;
var query = helper.newQuery();

make_request(host,'/nitro/api',api_key,query,'application/json',function(obj){
	console.log('JSON API');
	fs.writeFileSync('./nitroApi/api.json',JSON.stringify(obj,null,2));
	return false;
});
make_request(host,'/nitro/api',api_key,query,'text/xml',function(obj){
	console.log('XML API');
	fs.writeFileSync('./nitroApi/api.xml',obj);
	return false;
});
make_request(host,'/nitro/api/schema',api_key,query,'text/xml',function(obj){
	console.log('XML Schema');
	fs.writeFileSync('./nitroApi/nitro-schema.xsd',obj);
	return false;
});