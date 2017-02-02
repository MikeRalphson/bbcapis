var sdk = require('./nitroSdk.js');
var api = require('./nitroApi/api.js');

var config = require('./config.json');

var query = sdk.newQuery();
var pid = process.argv[2];
pid = pid.replace('.jpg','');
pid = pid.replace('.png','');
query.add(api.fImagesPid,pid,true);

var host = config.nitro.host;
var path = api.nitroImages;
var key = config.nitro.api_key;

function processResults(obj){
	console.log(JSON.stringify(obj.nitro.results,null,2));
}

function handleResponse(obj){
	processResults(obj);
	if (obj.nitro.pagination && obj.nitro.pagination.next) {
		var query = sdk.newQuery();
		query = query.fromString(obj.nitro.pagination.next.href,true);
		sdk.make_request(host,path,key,query,{},handleResponse,function(err){
		});
	}
}

if (process.argv.length<3) {
	console.log('Usage: imageInfo {image-pid}');
}
else {
	sdk.make_request(host,path,key,query,{},handleResponse,function(err){
	});
}
