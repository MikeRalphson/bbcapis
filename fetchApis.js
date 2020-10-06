'use strict';

const fs = require('fs');

const nitro = require('./nitroSdk');
const api = require('./nitroApi/api.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//_____________________________________________________________________________
let config, apiKey, host;
try {
	config = require('./config.json');
	apiKey = config.nitro.api_key;
	host = config.nitro.host;
}
catch (e) {
	console.log('Please rename config.json.example to config.json and edit for your setup');
	process.exit(2);
}
let query = nitro.newQuery();

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
let iblKey = 'dummy';
nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/status',iblKey,query,{},function(obj){
	console.log('iBL status '+obj.status.service+' v'+obj.version+' r'+obj.status.release);
	fs.writeFileSync('./iblApi/ibl_status.json',JSON.stringify(obj,null,2));
	return false;
});

nitro.make_request('rms.api.bbc.co.uk','/docs/swagger.json','',query,{proto:'https'},function(obj){
	console.log('RMS (BLUR/PULP) openapi.json');
	fs.writeFileSync('./rmsApi/openapi.json',JSON.stringify(obj,null,2));
	return false;
});

nitro.make_request('galileo.api.bbc.com','/v2/api-docs','',query,{proto:'https'},function(obj){
	console.log('Galileo swagger.json');
	fs.writeFileSync('./galileoApi/swagger.json',JSON.stringify(obj,null,2));
	return false;
});

nitro.make_request('raw.githubusercontent.com','/bbc/simorgh/latest/data/schema.yaml','',query,{proto:'https',headers:{Accept:'text/x-yaml'}},function(obj){
	console.log('Simorgh schema.yaml');
	fs.writeFileSync('./simorghApi/openapi.yaml',obj);
	return false;
});

nitro.make_request('access.api.bbc.com','/api-docs','',query,{proto:'https',headers:{Accept:'application/json'}},function(obj){
	console.log('Access API');
	fs.writeFileSync('./accessApi/swagger.json',JSON.stringify(obj,null,2));
	return false;
});

nitro.make_request('locator-service.test.api.bbci.co.uk','/v2/api-docs','',query,{proto:'https',headers:{Accept:'application/json'}},function(obj){
	console.log('Locator API');
	fs.writeFileSync('./locatorApi/swagger.json',JSON.stringify(obj,null,2));
	return false;
});

nitro.make_request('isl.britbox.co.uk','/api/spec','',query,{proto:'https',headers:{Accept:'application/json'}},function(obj){
	console.log('BritBox API');
	fs.writeFileSync('./britboxApi/swagger.json',JSON.stringify(obj,null,2));
	return false;
});

query.add(api.fProgrammesPartnerPid,'s0000024',true);
query.add(api.fProgrammesPageSize,1);
nitro.make_request(host,api.nitroProgrammes,apiKey,query,{headers:{Accept: 'application/json'}},function(obj){
	let total = (typeof obj.nitro.results.total !== 'undefined') ? obj.nitro.results.total : obj.nitro.results.more_than+1;
	if (total>0) {
	  console.log('Internal programmes present');
	}
	return false;
});

query.add(api.fProgrammesEntityTypeClip);
nitro.make_request(host,api.nitroProgrammes,apiKey,query,{headers:{Accept: 'application/json'}},function(obj){
	let total = (typeof obj.nitro.results.total !== 'undefined') ? obj.nitro.results.total : obj.nitro.results.more_than+1;
	if (total>0) {
	  console.log('Internal clips present');
	}
	return false;
});
