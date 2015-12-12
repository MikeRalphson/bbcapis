/*

BBC searchSuggest API

http://search-suggest.api.bbci.co.uk/search-suggest/suggest?q={query}&scope=iplayer&format=bigscreen-2&mediatype=video&mediaset={mediaset}&apikey={apikey}

*/

var getopt = require('node-getopt');

var nitro = require('./nitroCommon');
var helper = require('./apiHelper');

function pad(str, padding, padRight) {
	if (typeof str === 'undefined')
		return padding;
	if (padRight) {
		return (str + padding).substring(0, padding.length);
	} else {
		return (padding + str).slice(-padding.length);
	}
}

var config = require('./config.json');
var mediaSet = config.nitro.mediaset;
var key = config.searchSuggest.api_key;
var host = config.searchSuggest.host;
var mediaType = 'audio';

var go = getopt.create([
	['h','help','show this help'],
	['d','domain=ARG','set search domain, tv or radio*']
]).bindHelp();

go.on('domain',function(argv,options){
	if (options.domain == 'tv') {
		mediaType = 'video';
	}
	else if (options.domain == 'radio') {
		mediaType = 'audio';
	}
});

var options = go.parseSystem();

var searchTerm = options.argv[0];

var query = helper.newQuery();
query.add('scope','iplayer',true)
	.add('format','bigscreen-2')
	.add('mediatype',mediaType) // 'video' or 'audio'
	.add('mediaset',mediaSet)
	.add('q',searchTerm);
	
nitro.make_request(host,'/search-suggest/suggest',key,query,
	{api_key_name:'apikey'},function(obj){
		for (var i in obj[1]) {
			var o = obj[1][i];
			for (var t in o.tleo) {
				var tleo = o.tleo[t];
				console.log(tleo.pid+' '+pad(tleo.type,'       ',true)+' '+tleo.title);
			}
		}
	});