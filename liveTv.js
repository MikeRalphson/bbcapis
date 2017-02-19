var sdk = require('./nitroSdk.js');
var api = require('./nitroApi/api.js');

// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_two_england/mediaset/stb-hd-h264

var fs = require('fs');
var refs = {};

function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}

function uniqueOnly(value, index, self) { 
	return self.indexOf(value) === index;
}

function getHref(key){
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
			console.log('http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_two_england/mediaset/'+mediaset);
			var path = '/mediaselector/5/select/version/2.0/vpid/bbc_two_england/mediaset/'+mediaset+'/format/json';
			options.payload = {};
			options.payload.mediaset = mediaset;
			sdk.make_request('open.live.bbc.co.uk',path,key,query,options,function(obj,payload){
				//console.log(JSON.stringify(obj,null,2));
				if (obj.media) {
					for (var media of obj.media) {
						var cm = clone(media);
						delete cm.connection;
						for (var conn of media.connection) {
							if ((conn.href.indexOf('m3u8')>=0) && (conn.href.indexOf('https:')<0)) {
								//console.log(conn.href);
								conn.media = cm;
								conn.key = cm.width+'x'+cm.height+'@'+cm.bitrate+'/'+conn.supplier.substr(0,2);
								conn.mediaset = payload.mediaset;
								refs[conn.href]=conn;
							}
						}
					}
				}
			});
		}
	}
}

process.on('exit',function(code){
	console.log(JSON.stringify(refs,null,2));
	var keys = [];
	for (var href in refs) {
		keys.push(refs[href].key);
	}
	keys = keys.sort();
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

	var channels = [
		'bbc_one_hd',
		'bbc_two_england',
		'bbc_four',
		'cbbc',
		'cbeebies',
		'bbc_news24',
		'bbc_parliament',
		'bbc_alba',
		's4cpbs',
		'bbc_one_cambridge',
		'bbc_one_channel_islands',
		'bbc_one_east',
		'bbc_one_east_midlands',
		'bbc_one_east_yorkshire',
		'bbc_one_london',
		'bbc_one_north_east',
		'bbc_one_north_west',
		'bbc_one_northern_ireland',
		'bbc_one_oxford',
		'bbc_one_scotland',
		'bbc_one_south',
		'bbc_one_south_east',
		'bbc_one_south_west',
		'bbc_one_wales',
		'bbc_one_west',
		'bbc_one_west_midlands',
		'bbc_one_yorks',
		'bbc_two_northern_ireland_digital',
		'bbc_two_scotland',
		'bbc_two_wales_digital'
	];

	for (var channel of channels) {
		s += channel + '|';
		for (var key of keys) {
			var href = getHref(key);
			if (href) {
				s += '['+href.mediaset+']('+href.href.replace('bbc_two_england',channel)+')|';
			}
			else s += '|';
		}
		s += '\n';
	}

	fs.writeFileSync('./liveTv.md',s,'utf8');
});
