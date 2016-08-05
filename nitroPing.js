/* nitro ping */

var nitro = require('./nitroSdk.js');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

var start = new Date();

nitro.ping(host,api_key,{},function(obj){
	var end = new Date();
	console.log('1 Packet sent, 1 received. Elapsed time '+(end-start)+'ms');
});