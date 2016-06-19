/*

Lists Nitro linear services (the delivery mechanisms for programme delivery)

*/

function processResponse(obj) {
	for (var m in obj.nitro.results.items) {
		var serv = obj.nitro.results.items[m];
		console.log(serv.sid+','+serv.name+','+serv.media_type+','+(serv.description ? serv.description : '')+','+serv.partner);
	}
	var dest = {};
	if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
		dest.query = nitro.queryFrom(obj.nitro.pagination.next.href,true);
		dest.path = path;
		dest.callback = processResponse;
	}
	nitro.setReturn(dest);
	return true;
}

var nitro = require('./nitroSdk');
var api = require('./nitroApi/api');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

var path = api.nitroServices;

if (process.argv.length>2) {
	for (var i=2;i<23;i++) {
		var p = i.toString();
		while (p.length<7) {
			p = '0'+p;
		}
		var query = nitro.newQuery();
		query.add(api.fServicesPartnerPid,'s'+p,true);
		nitro.make_request(host,path,api_key,query,{},processResponse);
	}
}
else {
	var query = nitro.newQuery();
	nitro.make_request(host,path,api_key,query,{},processResponse);
}

process.on('exit', function(code) {
	//console.log('About to exit with code:', code);
});