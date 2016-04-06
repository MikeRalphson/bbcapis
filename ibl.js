'use strict';

var http = require('http');
var helper = require('./apiHelper');
var nitro = require('./nitroCommon');

var ibl_key = '';

// BBC iPlayer Business Layer
// ibl-nibl is delivered by a service called edibl :)

// http://ibl.api.bbci.co.uk/ibl/v1/schema/ibl.json?api_key=APIKEY

// http://ibl.api.bbci.co.uk/ibl/v1/status
// {"version":"1.0","schema":"/ibl/v1/schema/ibl.json","service":"ibl-nibl","release":"323"}

// rights = tv|mobile|web
// lang = en|cy|ga|gd
// availability = available|all
// sort = title|?
// sort_direction = asc|desc
// live = true

// https://github.com/middric/bamboo

//_____________________________________________________________________________
function showStatus() {
	// http://ibl.api.bbci.co.uk/ibl/v1/status
	var query = helper.newQuery();
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/status',ibl_key,query,{},function(obj){
		console.log(JSON.stringify(obj,null,2));
		return false;
	});
}

//_____________________________________________________________________________
function showCategories() {
	//http://ibl.api.bbci.co.uk/ibl/v1/categories?lang=en&api_key=APIKEY
	//http://ibl.api.bbci.co.uk/ibl/v1/categories/drama-and-soaps?lang=en&api_key=APIKEY
	var query = helper.newQuery();
	query.add('lang','en');
	//query.add('rights','mobile');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories',ibl_key,query,{},function(obj){
		console.log();
		for (var i in obj.categories) {
			var cat = obj.categories[i];
			console.log(cat.id+' '+cat.title+' '+cat.kind);
			var sQuery = helper.newQuery();
			sQuery.add('lang','en');
			nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories/'+cat.id,ibl_key,query,{},function(obj){
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
	var query = helper.newQuery();
	query.add('lang','en');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/channels',ibl_key,query,{},function(obj){
		console.log(JSON.stringify(obj,null,2));
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
	query.add('rights','web'); //mobile
	query.add('availability','available');
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/programmes/'+pid,ibl_key,query,{},function(obj){
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
	var query = helper.newQuery();
	//query.add('lang','en');
	query.add('rights','web'); //mobile
	query.add('availability','available');
	query.add('media_type','audio'); //?
	query.add('per-page',20);
	let options = {};
	nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories/'+cat+'/programmes',ibl_key,query,options,function(obj){
		dumpProgrammes(obj);

		//delete(obj.category_programmes.elements);
		console.log(JSON.stringify(obj,null,2));

		var total = obj.category_programmes.count;
		var pageNo = 1;
		var count = 0;
		while (count<=total) {
			var nQuery = query.clone();
			pageNo++;
			count = count + 20;
			nQuery.add('page',pageNo);
			nitro.make_request('ibl.api.bbci.co.uk','/ibl/v1/categories/'+cat+'/programmes',ibl_key,nQuery,options,function(obj){
				dumpProgrammes(obj);
			});
		}

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
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_one_london/programmes?lang=en&rights=tv&availability=available&page=%n&api_key=
 Programmes on BBC Two
 http://ibl.api.bbci.co.uk/ibl/v1/channels/bbc_two_england/programmes?lang=en&rights=tv&availability=available&page=%n&api_key=
 Programmes Arts Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/arts/programmes?lang=en&rights=tv&availability=available&page=%n&api_key=
 Programmes CBBC Category
 http://ibl.api.bbci.co.uk/ibl/v1/categories/cbbc/programmes?lang=en&rights=tv&availability=available&page=%n&api_key=

 List episodes for show id b04nv6kr
 http://ibl.api.bbci.co.uk/ibl/v1/episodes/b04nv6kr?rights=mobile&availability=available&api_key=

    "mostPopularUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/groups/popular/episodes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
    "atozUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/atoz/{letter}/programmes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
				{base_uri}/ibl/v1/atoz/{letter}/programmes?page={page}
	"categoriesUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/categories/{category}/programmes?rights=web&page=1&per_page=40&initial_child_count=4&sort=title&sort_direction=asc&availability=available&api_key=",
    "channelsUrl" : "http://ibl.api.bbci.co.uk/ibl/v1/channels/{channel_id}/programmes?rights=web&page=1&per_page=40&availability=available&api_key=",
	
"28" : "http://open.live.bbc.co.uk/ibl/v1/categories/%s/programmes?rights=mobile&page=%s&per_page=%s&sort=title&sort_direction=asc&initial_child_count=%s&availability=available&api_key=",
"29" : "http://open.live.bbc.co.uk/ibl/v1/home/highlights?lang=en&rights=mobile&availability=available&api_key=",
"30" : "http://open.live.bbc.co.uk/ibl/v1/programmes/%s/episodes?rights=mobile&availability=available&page=%s&per_page=%s&api_key=",
"31" : "http://open.live.bbc.co.uk/ibl/v1/episodes/%s/recommendations?rights=mobile&availability=available&page=%s&per_page=%s&api_key=",
"32" : "http://open.live.bbc.co.uk/ibl/v1/episodes/%s?rights=mobile&availability=available&api_key=",
"33" : "http://open.live.bbc.co.uk/ibl/v1/programmes/{programmeid}?rights=mobile&availability=available&api_key={apikey}"

// http://polling.bbc.co.uk/appconfig/iplayer/android/4.17.2/endpoints.json
"15" : "http://ibl.api.bbci.co.uk/ibl/v1/categories?lang=en&api_key=",
"16" : "http://ibl.api.bbci.co.uk/ibl/v1/categories/%s/highlights?lang=en&rights=mobile&availability=available&mixin=promotions&api_key=",
"17" : "http://ibl.api.bbci.co.uk/ibl/v1/channels?lang=en&api_key=",
"18" : "http://ibl.api.bbci.co.uk/ibl/v1/channels/%s/highlights?lang=en&rights=mobile&availability=available&live=true&mixin=promotions&api_key=",

https://ibl.api.bbci.co.uk/ibl/v1/user/watching?identity_cookie=%s

*/

var cat = 'drama-sci-fi-and-fantasy';
if (process.argv.length>2) cat = process.argv[2];

var query = helper.newQuery();

nitro.make_request('polling.bbc.co.uk','/appconfig/iplayer/android/4.16.0/config.json','',query,{},function(obj){
	ibl_key = obj.BBCIBL.BBCIBLKey;
	//showCategories();
	//showChannels();
	//showRegions();
	//showChildren('b03gh4r2');

	//showProgrammesForCategory('drama-sci-fi-and-fantasy');
	//showProgrammesForCategory(cat);
	
	showStatus();
	console.log(ibl_key);
	return false;
});