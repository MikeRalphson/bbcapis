'use strict';

var fs = require('fs');

var nitro = require('./nitroSdk');

//_____________________________________________________________________________
var config, apiKey, host;
try {
	config = require('./config.json');
	apiKey = config.nitro.api_key;
	host = config.nitro.host;
}
catch (e) {
	console.log('Please rename config.json.example to config.json and edit for your setup');
	process.exit(2);
}
var query = nitro.newQuery();

nitro.make_request(host,'/nitro/api',apiKey,query,{headers:{Accept: 'application/json'}},function(obj){
	console.log('Nitro JSON API');
	fs.writeFileSync('./nitroApi/api.json',JSON.stringify(obj,null,2));
	return false;
});
nitro.make_request(host,'/nitro/api',apiKey,query,{headers:{Accept: 'text/xml'}},function(obj){
	console.log('Nitro XML API');
	fs.writeFileSync('./nitroApi/api.xml',obj);
	return false;
});
nitro.make_request(host,'/nitro/api/schema',apiKey,query,{headers:{Accept: 'text/xml'}},function(obj){
	console.log('Nitro XML Schema');
	fs.writeFileSync('./nitroApi/nitro-schema.xsd',obj);
	return false;
});
nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/schema/ibl.json','',query,{headers:{Accept:'application/json'}},function(obj){
	console.log('iBL JSON Schema');
	fs.writeFileSync('./iblApi/ibl.json',JSON.stringify(obj,null,2));
	return false;
});
var iblKey = 'dummy';
nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/status',iblKey,query,{},function(obj){
	console.log('iBL status '+obj.status.service+' v'+obj.version+' r'+obj.status.release);
	fs.writeFileSync('./iblApi/ibl_status.json',JSON.stringify(obj,null,2));
	return false;
});
