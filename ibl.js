'use strict';

var http = require('http');
var ibl = require('./iblApi/ibl.js');
var nitro = require('./nitroSdk');

var ibl_key = '';

// BBC iPlayer Business Layer
// ibl-nibl is delivered by a service called edibl :)

// https://github.com/middric/bamboo

//_____________________________________________________________________________
function showStatus() {
	// http://ibl.api.bbci.co.uk/ibl/v1/status
	var query = nitro.newQuery();
	nitro.make_request(ibl.host,ibl.getStatus,ibl_key,query,{},function(obj){
		console.log(JSON.stringify(obj,null,2));
		return false;
	});
}

//_____________________________________________________________________________
function showCategories() {
	//http://ibl.api.bbci.co.uk/ibl/v1/categories?lang=en&api_key=APIKEY
	//http://ibl.api.bbci.co.uk/ibl/v1/categories/drama-and-soaps?lang=en&api_key=APIKEY
	//http://www.bbc.co.uk/iplayer/js/categories.json
	var query = nitro.newQuery();
	query.add(ibl.commonLangEn);
	nitro.make_request(ibl.host,ibl.getCategories,ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.categories) {
			var cat = obj.categories[i];
			console.log(cat.id+' '+cat.title+' '+cat.kind);
			var sQuery = nitro.newQuery();
			sQuery.add(ibl.commonLangEn);
			//console.log(cat);
			nitro.make_request(ibl.host,ibl.getCategories2(cat.id),ibl_key,sQuery,{},function(obj){
				for (var sc in obj.category.sub_categories) {
					var subcat = obj.category.sub_categories[sc];
					console.log('  '+subcat.id+' '+subcat.contextual_title+' '+subcat.kind+' '+subcat.child_programme_count+'>'+subcat.child_episode_count);
					if (subcat.sub_categories.length>0) {
						console.log(JSON.stringify(subcat.sub_categories,null,2));
					}
				}
			});
		}
		return false;
	});
}

//_____________________________________________________________________________
function showChannels() {
	//http://ibl.api.bbci.co.uk/ibl/v1/channels?lang=en&api_key=APIKEY
	var query = nitro.newQuery();
	query.add(ibl.commonLangEn);
	nitro.make_request(ibl.host,ibl.getChannels,ibl_key,query,{},function(obj){
		console.log(JSON.stringify(obj,null,2));
		for (var i in obj.channels) {
			var ch = obj.channels[i];
			console.log(ch.id+' '+ch.title+' '+ch.master_brand_id);
		}
		return false;
	});
	showRegionalChannels();
}

//_____________________________________________________________________________
function showStreams() {
	//http://ibl.api.bbci.co.uk/ibl/v1/channels?lang=en&api_key=APIKEY
	var query = nitro.newQuery();
	query.add(ibl.commonLangEn);
	nitro.make_request(ibl.host,ibl.getChannels,ibl_key,query,{},function(obj){
		console.log(JSON.stringify(obj,null,2));
		for (var i in obj.channels) {
			var ch = obj.channels[i];
			console.log('['+ch.title+'](http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/hls_tablet_rw/llnw/'+ch.master_brand_id+'.m3u8)');
		}
		return false;
	});
}

//_____________________________________________________________________________
function showRegions() {
	//http://ibl.api.bbci.co.uk/ibl/v1/regions?lang=en&api_key=APIKEY
	var query = nitro.newQuery();
	query.add(ibl.commonLangEn);
	nitro.make_request(ibl.host,ibl.getRegions,ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.regions) {
			var region = obj.regions[i];
			console.log(region.id+' '+region.title);
		}
		return false;
	});
}

//_____________________________________________________________________________
function showRegionalChannels() {
	//http://ibl.api.bbci.co.uk/ibl/v1/regions?lang=en&api_key=APIKEY
	var query = nitro.newQuery();
	query.add(ibl.commonLangEn);
	nitro.make_request(ibl.host,ibl.getRegions,ibl_key,query,{},function(obj){
		//console.log();
		for (var i in obj.regions) {
			var region = obj.regions[i];
			//console.log(region.id+' '+region.title);
			var nq = nitro.newQuery();
			nq.add(ibl.commonLangEn);
			nq.add(ibl.getChannelsRegion,region.id);
			nitro.make_request(ibl.host,ibl.getChannels,ibl_key,nq,{payload:region},function(obj,payload){
				for (var chan of obj.channels) {
					console.log(payload.id,chan.id);
				}
			});
		}
		return false;
	});
}

//_____________________________________________________________________________
function showChildren(pid) {
	// http://ibl.api.bbci.co.uk/ibl/v1/episodes/b04nv6kr?rights=mobile&availability=available&api_key=APIKEY
	var query = nitro.newQuery();
	query.add(ibl.commonRightsWeb);
	query.add(ibl.commonAvailabilityAvailable);
	nitro.make_request(ibl.host,ibl.getProgrammes(pid),ibl_key,query,{},function(obj){
		for (var i in obj.programmes) {
			var p = obj.programmes[i];
			for (var j in p.initial_children) {
				var c = p.initial_children[j];
				console.log('*'+c.id+' '+c.type+' '+c.title+' '+c.subtitle);
				//console.log(JSON.stringify(c,null,2));
				if ((p.type == 'brand') || (p.type == 'series')) {
					showChildren(p.id);
				}
			}
		}
	});
}

//_____________________________________________________________________________
function dumpProgrammes(obj) {
	for (var e in obj.category_programmes.elements) {
		var p = obj.category_programmes.elements[e];
		console.log(p.id+' '+p.tleo_type+' '+p.title);
		if ((p.tleo_type == 'brand') || (p.tleo_type == 'series')) {
			showChildren(p.id);
		}
	}
}

//_____________________________________________________________________________
function showProgrammesForCategory(cat) {
	// http://ibl.api.bbci.co.uk/ibl/v1/categories/CAT/programmes?rights=mobile&availability=available&api_key=APIKEY
	var query = nitro.newQuery();

	query.add(ibl.commonRightsWeb);
	query.add(ibl.commonAvailabilityAvailable);
	query.add(ibl.commonPerPage,20);
	let options = {};
	nitro.make_request(ibl.host,ibl.getCategoriesProgrammes(cat),ibl_key,query,options,function(obj){
		dumpProgrammes(obj);

		console.log(JSON.stringify(obj,null,2));

		var total = obj.category_programmes.count;
		var pageNo = 1;
		var count = 0;
		while (count<=total) {
			var nQuery = query.clone();
			pageNo++;
			count = count + 20;
			nQuery.add(ibl.commonPage,pageNo);
			nitro.make_request(ibl.host,ibl.getCategoriesProgrammes(cat),ibl_key,nQuery,options,function(obj){
				dumpProgrammes(obj);
			});
		}

	});
}

//_____________________________________________________________________________

var cat = 'drama-sci-fi-and-fantasy';
if (process.argv.length>2) cat = process.argv[2];

var query = nitro.newQuery();
nitro.make_request('polling.bbc.co.uk','/appconfig/iplayer/android/4.16.0/config.json','',query,{},function(obj){
	ibl_key = obj.BBCIBL.BBCIBLKey;
	if ((cat == 'cat') || (cat == 'categories')) {
		showCategories();
	}
	else if ((cat == 'chan') || (cat == 'channels')) {
		showChannels();
	}
	else if ((cat == 'm3u8') || (cat == 'streams')) {
		showStreams();
	}
	else if ((cat == 'reg') || (cat == 'regions')) {
		showRegions();
	}
	else if (cat.match(/^([0-9,a-d,f-h,j-n,p-t,v-z]){8,}$/)) {
		showChildren(cat);
	}
	else {
		showProgrammesForCategory(cat);
	}

	showStatus();
	console.log(ibl_key);
	return false;
});
