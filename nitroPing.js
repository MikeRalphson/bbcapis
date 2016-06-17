/* nitro ping */

var nitro = require('./nitroCommon.js');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

nitro.ping(host,api_key,{},function(obj){
	console.log(JSON.stringify(obj,null,2));
});
