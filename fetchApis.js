'use strict';

var fs = require('fs');

var nitro = require('./nitroSdk');

//_____________________________________________________________________________

var config = require('./config.json');
var api_key = config.nitro.api_key;
var host = config.nitro.host;
var query = nitro.newQuery();

nitro.make_request(host,'/nitro/api',api_key,query,{Accept:'application/json'},function(obj){
	console.log('Nitro JSON API');
	fs.writeFileSync('./nitroApi/api.json',JSON.stringify(obj,null,2));
	return false;
});
nitro.make_request(host,'/nitro/api',api_key,query,{Accept:'text/xml'},function(obj){
	console.log('Nitro XML API');
	fs.writeFileSync('./nitroApi/api.xml',obj);
	return false;
});
nitro.make_request(host,'/nitro/api/schema',api_key,query,{Accept:'text/xml'},function(obj){
	console.log('Nitro XML Schema');
	fs.writeFileSync('./nitroApi/nitro-schema.xsd',obj);
	return false;
});
nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/schema/ibl.json','',query,{Accept:'application/json'},function(obj){
	console.log('iBL JSON Schema');
	fs.writeFileSync('./iblApi/ibl.json',JSON.stringify(obj,null,2));
	return false;
});
var ibl_key = 'dummy';
nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/status',ibl_key,query,{},function(obj){
	console.log('iBL status '+obj.status.service+' v'+obj.version+' r'+obj.status.release);
	fs.writeFileSync('./iblApi/ibl_status.json',JSON.stringify(obj,null,2));
	return false;
});