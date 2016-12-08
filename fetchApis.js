'use strict';

var fs = require('fs');

var nitro = require('./nitroSdk');
var api = require('./nitroApi/api.js');

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
query.add(api.fProgrammesPartnerPid,'s0000024',true);
query.add(api.fProgrammesPageSize,1);
nitro.make_request(host,api.nitroProgrammes,apiKey,query,{headers:{Accept: 'application/json'}},function(obj){
	var total = (typeof obj.nitro.results.total !== 'undefined') ? obj.nitro.results.total : obj.nitro.results.more_than+1;
	if (total>0) {
	  console.log('Internals present');
	}
	return false;
});
