'use strict';

var http = require('http');
var helper = require('./apiHelper');
var nitro = require('./nitroCommon');

var ibl_key = '';

// http://ibl.api.bbci.co.uk/ibl/v1/schema/ibl.json?api_key=APIKEY

// http://ibl.api.bbci.co.uk/ibl/v1/status
// {"version":"1.0","schema":"/ibl/v1/schema/ibl.json","service":"ibl-nibl","release":"320"}

// https://github.com/middric/bamboo
// 

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
			//console.log(JSON.stringify(cat,null,2));
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
	//query.add('lang','en');
	query.add('rights','mobile');
	query.add('availability','available');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/episodes/'+pid,ibl_key,query,{},function(obj){
		console.log(obj);
	});
}

function showProgrammesForCategory(cat) {
	// http://ibl.api.bbci.co.uk/ibl/v1/category_programmes/CAT?rights=mobile&availability=available&api_key=APIKEY
	var query = helper.newQuery();
	//query.add('lang','en');
	query.add('rights','mobile');
	query.add('availability','available');
	//query.add('category',cat);
	let options = {};
	//options.Accept = 'application/xml';
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories/'+cat+'/programmes',ibl_key,query,options,function(obj){
		for (var e in obj.category_programmes.elements) {
			var p = obj.category_programmes.elements[e];
			console.log(p.id+' '+p.tleo_type+' '+p.title);		
		}
		console.log(JSON.stringify(obj,null,2));
	});
}

//_____________________________________________________________________________

// http://polling.bbc.co.uk/appconfig/iplayer/android/4.15.0/config.json

// http://ibl.api.bbci.co.uk/ibl/v1/home/highlights?lang=en&rights=mobile&availability=available&api_key=

/*
 Highlights Full
 http://ibl.api.bbci.co.uk/ibl/v1/home/highlights?lang=en&rights=tv&availability=available&api_key=
 Highlights BBC one
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_one_london/highlights?lang=en&rights=mobile&availability=available&api_key=
 Highlights BBC Two
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_two_england/highlights?lang=en&rights=mobile&availability=available&api_key=
 Highlights for Arts Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/arts/highlights?lang=en&rights=mobile&availability=available&api_key=
 Highlights for CBBC Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/cbbc/highlights?lang=en&rights=mobile&availability=available&api_key=

 Programmes on BBC One
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_one_london/programmes?lang=en&rights=tv&availability=available&api_key=
 Programmes on BBC Two
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_two_england/programmes?lang=en&rights=tv&availability=available&api_key=
 Programmes Arts Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/arts/programmes?lang=en&rights=tv&availability=available&api_key=
 Programmes CBBC Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/cbbc/programmes?lang=en&rights=tv&availability=available&api_key=

 List episodes for show id b04nv6kr
 http://ibl.api.bbci.co.uk/ibl/v1/episodes/b04nv6kr?rights=mobile&availability=available&api_key=
 
    "mostPopularUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/groups/popular/episodes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
    "atozUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/atoz/{letter}/programmes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
				{base_uri}/ibl/v1/atoz/{letter}/programmes?page={page}
	"categoriesUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/categories/{category}/programmes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
    "channelsUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/channels/{channel_id}/programmes?rights=web&page=1&per_page=40&availability=available&api_key=",

*/

var query = helper.newQuery();

nitro.make_request('polling.bbc.co.uk','/appconfig/iplayer/android/4.15.0/config.json','',query,{},function(obj){
	ibl_key = obj.BBCIBL.BBCIBLKey;
	showCategories();
	//showChannels();
	//showRegions();
	//showChildren('b0072txy');
	showProgrammesForCategory('drama-sci-fi-and-fantasy');
	console.log(ibl_key);
	return false;
});

