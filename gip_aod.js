// http://iplayer-radio-mobile-appconfig.files.bbci.co.uk/appconfig/iplayerradio/radio/stations.json

// http://www.bbc.co.uk/radio/aod/availability/radio4.xml
// http://www.bbc.co.uk/radio/aod/availability/radio4extra.xml

var util = require('util');
var sdk = require('./nitroSdk.js');
var x2j = require('jgexml/xml2json.js');

var static = [
 'radio1.xml',
 '1xtra.xml',
 'radio2.xml',
 '6music.xml',
 'radio3.xml',
 'radio4.xml',
 'radio4extra.xml',
 'fivelive.xml',
 'sportsextra.xml',
 'asiannetwork.xml',
 'alba.xml',
 'radioscotland.xml',
 'radioulster.xml',
 'radiofoyle.xml',
 'radiowales.xml',
 'radiocymru.xml',
 'bbc_london.xml',
 'bbc_radio_berkshire.xml',
 'bbc_radio_bristol.xml',
 'bbc_radio_cambridge.xml',
 'bbc_radio_cornwall.xml',
 'bbc_radio_coventry_warwickshire.xml',
 'bbc_radio_cumbria.xml',
 'bbc_radio_derby.xml',
 'bbc_radio_devon.xml',
 'bbc_radio_essex.xml',
 'bbc_radio_gloucestershire.xml',
 'bbc_radio_guernsey.xml',
 'bbc_radio_hereford_worcester.xml',
 'bbc_radio_humberside.xml',
 'bbc_radio_jersey.xml',
 'bbc_radio_kent.xml',
 'bbc_radio_lancashire.xml',
 'bbc_radio_leeds.xml',
 'bbc_radio_leicester.xml',
 'bbc_radio_lincolnshire.xml',
 'bbc_radio_manchester.xml',
 'bbc_radio_merseyside.xml',
 'bbc_radio_newcastle.xml',
 'bbc_radio_norfolk.xml',
 'bbc_radio_northampton.xml',
 'bbc_radio_nottingham.xml',
 'bbc_radio_oxford.xml',
 'bbc_radio_sheffield.xml',
 'bbc_radio_shropshire.xml',
 'bbc_radio_solent.xml',
 'bbc_radio_somerset_sound.xml',
 'bbc_radio_stoke.xml',
 'bbc_radio_suffolk.xml',
 //'bbc_radio_swindon.xml',
 //'bbc_radio_wiltshire.xml',
 'bbc_radio_york.xml',
 //'bbc_southern_counties_radio.xml',
 //'bbc_tees.xml',
 'bbc_three_counties_radio.xml',
 'bbc_wm.xml',
 'worldservice.xml'
];

/*
      {
        "@pid": "p0512vf5",
        "key": "2302673c7b434781cb94c6d3c0f5a4acd71b3718",
        "pid": "p0512v34",
        "service": "bbc_world_service",
        "title": "The Why Factor: Habits",
        "synopsis": "Shiulie Ghosh explains why we are all creatures of habits",
        "availability": {
          "@start": "2017-05-02T01:50:00Z",
          "@end": "2017-05-09T01:50:00Z"
        },
        "broadcast": {
          "@pid": "p0512vw4",
          "@version_pid": "p0512vf5",
          "@imi": "imi:ws.bbc.co.uk/264961493688750000",
          "@start": "2017-05-02T01:32:30Z",
          "@end": "2017-05-02T01:50:00Z",
          "@duration": "1050"
        },
        "parents": {
          "parent": {
            "@pid": "p00xtky9",
            "@type": "Brand",
            "#text": "The Why Factor"
          }
        },
        "links": {
          "link": [
            {
              "@transferformat": "dash",
              "@type": "mediaselector",
              "#text": "http://open.live.bbc.co.uk/mediaselector/5/redir/version/2.0/mediaset/audio-syndication-dash/proto/http/vpid/p0512vf5"
            },
            {
              "@transferformat": "hls",
              "@type": "mediaselector",
              "#text": "http://open.live.bbc.co.uk/mediaselector/5/redir/version/2.0/vpid/p0512vf5/mediaset/audio-syndication/proto/http"
            }
          ]
        },
        "images": {
          "image": "http://ichef.bbci.co.uk/images/ic/512x288/p0515lf3.jpg"
        }
      },
*/

var data = [];


function dump() {
	console.log('#index|type|name|pid|available|expires|episode|seriesnum|episodenum|versions|duration|desc|channel|categories|thumbnail|timeadded|guidance|web');
	var index = 10000;
	for (let station of data) {
		for (let entry of station.schedule.entry) {
			var s = ''+(index++)+'|radio|';
			s += entry.title+'|';
			s += entry.pid+'|';
			s += entry.availability['@start']+'|';
			s += new Date(entry.availability['@end'])/1000+'|';
			s += entry.synopsis + '|';
			s += '1|';
			s += '1|';
			s += 'original|';
			s += entry.broadcast['@duration']+'|';
			s += entry.synopsis+'|';
			s += entry.service+'|';
			s += '|';
			s += entry.images.image.replace('{recipe}','150x84')+'|';
			s += new Date()/1000;
			s += '|';
			s += 'http://bbc.co.uk/programmes/'+entry.pid;
			console.log(s);
		}
	}
}

function next(keys) {
	if (keys.length) {
		var key = keys.shift();
		console.error(key);
		var query = sdk.newQuery();
		sdk.make_request('www.bbc.co.uk','/radio/aod/availability/'+key,'',query,{headers:{accept:'application/xml'}},function(xml){
			var obj = x2j.xml2json(xml);
			data.push(obj);
			next(keys);
		},function(err){
			console.log('  Something went wrong');
			console.log(util.inspect(err));
			next(keys);
		});
	}
	else {
		dump(data);
	}
}

next(static);

