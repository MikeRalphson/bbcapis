/*

dlInfo.js

*/

var nitro = require('./nitroCommon');
var helper = require('./apiHelper');
var xmlToJson = require('./xmlToJson');

var pid = process.argv[2]; // e.g. b006v299

var q1 = helper.newQuery();

// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/{vpid}/format/json/mediaset/{mediaSet}/proto/http
// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/b006v299/format/json/mediaset/pc/proto/http

nitro.make_request('open.live.bbc.co.uk','/mediaselector/5/select/version/2.0/vpid/'+pid+
	'/format/json/mediaset/pc/proto/http','',q1,{'Accept': 'application/json'},function(obj){
	
	for (var i in obj.media) {
		var media = obj.media[i];
		console.log(media);
	}
	console.log();

// http://open.live.bbc.co.uk/axs/open/authxml?media_set=pc&version_pid=b006v299&format=xml
	var q2 = helper.newQuery();
	q2.add('media_set','pc')
		.add('version_pid',pid)
		.add('format','xml');

	nitro.make_request('open.live.bbc.co.uk','/axs/open/authxml','',q2,
		{'Accept': 'text/html,application/xhtml+xml,application/xml'},function(obj){
		console.log(xmlToJson.convert(obj));
	});
		
});
	