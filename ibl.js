'use strict';

var http = require('http');
var helper = require('./apiHelper');
var nitro = require('./nitroCommon');

var ibl_key = '';

// http://ibl.api.bbci.co.uk/ibl/v1/schema/ibl.json?api_key=APIKEY

//_____________________________________________________________________________
function showCategories() {
	//http://ibl.api.bbci.co.uk/ibl/v1/categories?lang=en&api_key=APIKEY
	var query = helper.newQuery();
	query.add('lang','en');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories',ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.categories) {
			var cat = obj.categories[i];
			console.log(cat.id+' '+cat.title);
		}
		return false;
	});
}

//_____________________________________________________________________________
function showChannels() {
	//http://ibl.api.bbci.co.uk/ibl/v1/channels?lang=en&api_key=APIKEY
	var query = helper.newQuery();
	query.add('lang','en');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/channels',ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.channels) {
			var ch = obj.channels[i];
			console.log(ch.id+' '+ch.title+' '+ch.master_brand_id);
		}		
		return false;
	});
}

//_____________________________________________________________________________
function showRegions() {
	//http://ibl.api.bbci.co.uk/ibl/v1/regions?lang=en&api_key=APIKEY
	var query = helper.newQuery();
	query.add('lang','en');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/regions',ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.regions) {
			var region = obj.regions[i];
			console.log(region.id+' '+region.title);
		}		
		return false;
	});
}

//_____________________________________________________________________________
function showChildren(pid) {
	// http://ibl.api.bbci.co.uk/ibl/v1/episodes/b04nv6kr?rights=mobile&availability=available&api_key=APIKEY
	var query = helper.newQuery();
	query.add('lang','en');
	query.add('rights','mobile');
	query.add('availability','available');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/episodes/'+pid,ibl_key,query,{},function(obj){
		console.log(obj);
	});
}

//_____________________________________________________________________________

// http://polling.bbc.co.uk/appconfig/iplayer/android/4.15.0/config.json

var query = helper.newQuery();

nitro.make_request('polling.bbc.co.uk','/appconfig/iplayer/android/4.15.0/config.json','',query,{},function(obj){
	ibl_key = obj.BBCIBL.BBCIBLKey;
	showCategories();
	showChannels();
	showRegions();
	showChildren('b006q2x0');
	return false;
});

