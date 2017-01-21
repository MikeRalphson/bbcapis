// http://www.bbc.co.uk/mediacentre/rss?path=%2Fsearch&widget=3&params=%7B%22term%22%3A%22science%20fiction%22%7D

var sdk = require('./nitroSdk.js');
var x2j = require('jgexml/xml2json.js');

var today = new Date();

var host = 'www.bbc.co.uk';
var path = '/mediacentre/rss';

var query = sdk.newQuery();
query.add('path','/search');
query.add('widget','3');
query.add('params','{"term":"science fiction"}');
var settings = {};
settings.headers = {};
settings.headers.Accept = 'application/xml';

sdk.make_request(host,path,'',query,settings,function(obj){
	var data = x2j.xml2json(obj);
	//console.log(JSON.stringify(data,null,2));
	for (var i of data.rss.channel.item) {
		var pubDate = new Date(i.pubDate);
		var diff = today-pubDate;
		diff = diff / (1000*60*60*24);
		if (diff<14) {
			console.log(pubDate.toString());
			console.log('  '+i.title);
			console.log('  '+i.link);
		}
	}
},
function(err){
});

