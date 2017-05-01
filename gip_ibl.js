'use strict';

var util = require('util');
var sdk = require('./nitroSdk.js');
var ibl = require('./iblApi/ibl.js');

const ibl_key = '';

var programmes = [];

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function dumpProgrammes() {

	var index = 100000;

	var entries = [];
	for (let programme of programmes) {
		var parent = clone(programme);
		delete parent.initial_children;
		for (let child of programme.initial_children) {
			child.parent = parent;
			entries.push(child);
		}
	}

	console.log('#index|type|name|pid|available|expires|episode|seriesnum|episodenum|versions|duration|desc|channel|categories|thumbnail|timeadded|guidance|web');

	for (let entry of entries) {
		if (entry.type == 'episode') {

			var versions = '';
			var duration = 0;
			for (let version of entry.versions) {
				versions = versions + (versions ? ',' : '') + version.kind;
				if (duration == 0) duration = version.duration.value;
			}

			var s = ''+(index++)+'|';
			s += 'tv|';
			s += entry.title + '|';
			s += entry.id + '|';
			s += entry.versions[0].availability.start + '|';
			s += entry.versions[0].availability.end||'' + '|';
			s += '1|';
			s += (entry.parent_position||1) + '|';
			s += versions +'|';
			s += sdk.iso8601durationToSeconds(duration) + '|';
			s += (entry.synopses.small ? entry.synopses.small : (entry.synopses.medium ?
				entry.synopses.medium : (entry.synopses.large ? entry.synopses.large : ''))) + '|';
			s += entry.master_brand.id + '|';
			s += entry.categories.join(',')+'|';
			s += entry.images.standard + '|';
			s += new Date().toISOString() + '|';
			s += entry.guidance + '|';
			s += 'http://bbc.co.uk/programmes/'+entry.id;

			console.log(s);

		}
	}
}

function getProgrammes(chid,page) {
	var query = sdk.newQuery();
   	query.add(ibl.commonLangEn);
   	query.add(ibl.commonPage,page);
	query.add(ibl.commonInitialChildCount,4);
	console.error(chid+' page: '+page);
   	sdk.make_request(ibl.host,ibl.getChannelsProgrammes(chid),ibl_key,query,{},function(obj){
		programmes = programmes.concat(obj.channel_programmes.elements);
		var position = (obj.channel_programmes.page * obj.channel_programmes.per_page);
		var here = obj.channel_programmes.elements.length;
		if ((position+here)<obj.channel_programmes.count) {
			getProgrammes(chid,++page);
		}
	});
}

function next(channels) {
	if (channels.length>=0) {
		var chid = channels.shift();
		getProgrammes(chid,1);
	}
}

function showChannels() {
	var channels = [];
    var query = sdk.newQuery();
    query.add(ibl.commonLangEn);
    sdk.make_request(ibl.host,ibl.getChannels,ibl_key,query,{},function(obj){
        for (let ch of obj.channels) {
			if (ch.id.indexOf('radio')<0) {
				channels.push(ch.id);
				if (channels.length==1) {
					next(channels);
				}
			}
        }
        return false;
    });
}

showChannels();

process.on('exit',function(code){
	dumpProgrammes();
});
