var sdk = require('./nitroSdk.js');
var api = require('./nitroApi/api.js');

// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_one_hd/mediaset/stb-hd-h264

var fs = require('fs');
var refs = {};
var dash = {};

var channels = [
	'bbc_one_hd',
	'bbc_two_hd',
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
	'bbc_two_england',
	'bbc_two_northern_ireland_digital',
	'bbc_two_scotland',
	'bbc_two_wales_digital',
	'sport_stream_01',
	'sport_stream_02',
	'sport_stream_03',
	'sport_stream_04',
	'sport_stream_05',
	'sport_stream_06',
	'sport_stream_07',
	'sport_stream_08',
	'sport_stream_09',
	'sport_stream_10',
	'sport_stream_11',
	'sport_stream_12',
	'sport_stream_13',
	'sport_stream_14',
	'sport_stream_15',
	'sport_stream_16',
	'sport_stream_17',
	'sport_stream_18',
	'sport_stream_19',
	'sport_stream_20',
	'sport_stream_21',
	'sport_stream_22',
	'sport_stream_23',
	'sport_stream_24',
	'sport_stream_01b',
	'sport_stream_02b',
	'sport_stream_03b',
	'sport_stream_04b',
	'sport_stream_05b',
	'sport_stream_06b',
	'sport_stream_07b',
	'sport_stream_08b',
	'sport_stream_09b',
	'sport_stream_10b',
	'sport_stream_11b',
	'sport_stream_12b',
	'sport_stream_13b',
	'sport_stream_14b',
	'sport_stream_15b',
	'sport_stream_16b',
	'sport_stream_17b',
	'sport_stream_18b',
	'sport_stream_19b',
	'sport_stream_20b',
	'sport_stream_21b',
	'sport_stream_22b',
	'sport_stream_23b',
	'sport_stream_24b'
];

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

	for (var channel of channels) {
		s += channel + '|';
		for (var key of keys) {
			var href = getHref(refs,key);
			if (href) {
				var url = href.href.replace('bbc_one_hd',channel);
				if (url.indexOf('stream')>0) {
					url = url.replace('simulcast','webcast');
				}
				s += '['+href.mediaset+']('+url+')|';
			}
			else s += '|';
		}
		s += '\n';
	}
	return s;
}

process.on('exit',function(code){
	fs.writeFileSync('./liveTv.md',output(refs),'utf8');
	fs.writeFileSync('./liveDash.md',output(dash),'utf8');
});
