/*

Lists Nitro partners

*/

function processResponse(obj) {
	for (var p in obj.nitro.results.items) {
		var partner = obj.nitro.results.items[p];
		console.log(partner.pid+','+partner.name+','+partner.description);
	}
	var dest = {};
	if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
		dest.query = helper.queryFrom(obj.nitro.pagination.next.href,true);
		dest.path = path;
		dest.callback = processResponse;
	}
	nitro.setReturn(dest);
	return true;
}

var nitro = require('./nitroCommon');
var helper = require('./apiHelper');
var api = require('./nitroApi/api');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

var path = api.nitroPips;

for (var i=1;i<99;i++) {
	var partnerId = i.toString();
	while (partnerId.length<7) {
		partnerId = '0' + partnerId;
	}
	var query = helper.newQuery();
	query.add(api.fPipsQ,'pid:s'+partnerId,true);
	nitro.make_request(host,path,api_key,query,{},processResponse);
}
process.on('exit', function(code) {
	//console.log('About to exit with code:', code);
});