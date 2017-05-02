var sdk = require('./nitroSdk.js');
var api = require('./nitroApi/api.js');

// https://ess.api.bbci.co.uk/services

// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_one_hd/mediaset/stb-hd-h264

var fs = require('fs');
var refs = {};
var dash = {};

var channels = require('./ess/services.json');

channels.items = channels.items.sort(function(a,b){
	if (a.name < b.name) return -1;
	if (a.name > b.name) return 1;
	return 0;
});

function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}

function uniqueOnly(value, index, self) { 
	return self.indexOf(value) === index;
}

function cmp(a,b){
	var widthA = Number(a.split('x')[0]);
	var widthB = Number(b.split('x')[0]);
	if (widthA > widthB) return -1;
	if (widthA < widthB) return 1;
	return 0;
}

function getHref(refs,key){
	for (var href in refs) {
		if (refs[href].key == key) return refs[href];
	}
	return null;
}

var infile = process.argv[2];
if (infile) {

	var query = sdk.newQuery();
	var key = '';
	var options = {};
	options.headers = {};
	options.headers.Accept = 'application/json';

	var lines = fs.readFileSync(infile,'utf8').split('\n');
	for (var line of lines) {
		var fields = line.split(' ');
		var vpid = fields[0];
		var desc = fields[1];
		var mediaset = fields[2];
		if (mediaset) {
			console.log('http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_one_hd/mediaset/'+mediaset);
			var path = '/mediaselector/5/select/version/2.0/vpid/bbc_one_hd/mediaset/'+mediaset+'/format/json';
			options.payload = {};
			options.payload.mediaset = mediaset;
			sdk.make_request('open.live.bbc.co.uk',path,key,query,options,function(obj,payload){
				//console.log(JSON.stringify(obj,null,2));
				if (obj.media) {
					for (var media of obj.media) {
						var cm = clone(media);
						delete cm.connection;
						for (var conn of media.connection) {
							conn.media = cm;
							conn.key = cm.width+'x'+cm.height+'@'+cm.bitrate+'/'+conn.supplier.substr(0,2);
							conn.mediaset = payload.mediaset;
							if ((conn.href.indexOf('m3u8')>=0) && (conn.href.indexOf('https:')<0)) {
								refs[conn.href] = conn;
							}
							if ((conn.href.indexOf('.mpd')>0) && (!dash[conn.href])) {
								dash[conn.href] = conn;
							}
						}
					}
				}
			},
			function(statusCode,data,payload){
				console.log('Err '+payload.mediaset);
			});
		}
	}
}

function output(refs) {
	console.log(JSON.stringify(refs,null,2));
	var keys = [];
	for (var href in refs) {
		keys.push(refs[href].key);
	}
	keys = keys.sort(cmp);
	keys = keys.filter(uniqueOnly);

	var s = '';
	s += '|Channel|';
	for (var key of keys) {
		s += key + '|'; 
	}
	s += '\n';
	s += '|---|';
	for (var key of keys) {
		s += '---|';
	}
	s += '\n';

	for (var channel of channels.items) {
		if (((channel.type == 'Simulcast') || (channel.type == 'TV') || 
		(channel.type == 'Webcast')) && (channel.mediaType == 'Video')) {
			s += channel.name + '|';
			for (var key of keys) {
				var href = getHref(refs,key);
				if (href) {
					var url = href.href.replace('bbc_one_hd',channel.id);
					if (channel.type == 'Webcast') {
						url = url.replace('simulcast','webcast');
					}
					s += '['+href.mediaset+']('+url+')|';
				}
				else s += '|';
			}
			s += '\n';
		}
	}
	return s;
}

process.on('exit',function(code){
	fs.writeFileSync('./markdown/liveTv.md',output(refs),'utf8');
	fs.writeFileSync('./markdown/liveDash.md',output(dash),'utf8');
});
