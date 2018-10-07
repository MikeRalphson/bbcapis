/*

dlInfo.js

*/

var nitro = require('./nitroSdk');
var xmlToJson = require('jgexml/xml2json');

var pid = process.argv[2]; // a version PID (vPID) e.g. b01r5278

var config = require('./config.json');
var mediaSet = config.nitro.mediaset;

if (process.argv.length>3) {
  mediaSet = process.argv[3]; // override the config mediaset
}

var q1 = nitro.newQuery();

// http://www.bbc.co.uk/mediaselector/3/auth/iplayer_streaming_http_mp4/b0094yrk
// http://www.bbc.co.uk/mediaselector/3/stream/check/iplayer?pid=PID
// http://www.bbc.co.uk/mediaselector/4/mtis/stream/{vpid}
// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/{vpid}/format/json/mediaset/{mediaSet}/proto/http
// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/b006v299/format/json/mediaset/pc/proto/http
// http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/vpid/bbc_two_england/mediaset/pc/atk/ce6cf9bb4e462e3f6128b168891a0010b06ba663/asn/1/

var options = {};
options.headers = {'Accept':'application/xml'};
nitro.make_request('www.bbc.co.uk','/mediaselector/4/mtis/stream/'+pid,'',q1,options,function(obj){
	console.log(JSON.stringify(xmlToJson.xml2json(obj),null,2));
});

function mediaselector5(proto){
	nitro.make_request('open.live.bbc.co.uk','/mediaselector/5/select/version/2.0/vpid/'+pid+
		'/format/json/mediaset/'+mediaSet+'/proto/'+proto,'',q1,{},function(obj){

		for (var i in obj.media) {
			var media = obj.media[i];
			console.log(media);
		}
		console.log();
	});
}

mediaselector5('http');
mediaselector5('rtmp');

// http://www.prweb.com/releases/2016/04/prweb13347368.htm
// http://open.live.bbc.co.uk/axs/open/authxml?media_set=pc&version_pid=b006v299&format=xml
// https://av-media-sslgate.live.bbc.co.uk/saml/axs/open/authxml?media_set=%s&version_pid=%s&format=base64
// https://open.live.bbc.co.uk/drmauth/1/version/1.0/mediaset/%s/vpid/%s/ (returns 403)
/*

MANIFEST

<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Unified Streaming Platform(version=1.7.9) -->
<SmoothStreamingMedia Duration="28864000000" TimeScale="10000000" MinorVersion="0" MajorVersion="2">
<StreamIndex TimeScale="10000000" Url="QualityLevels({bitrate})/Fragments(audio={start time})" Chunks="451" Name="audio" QualityLevels="1" Type="audio">
<QualityLevel FourCC="AACL" AudioTag="255" PacketSize="4" BitsPerSample="16" Channels="2" SamplingRate="48000" CodecPrivateData="1190" Bitrate="320000" Index="0"/>
<c t="0" d="64000000"/>
<c d="64000000"/>
...
<c d="64000000"/>
</StreamIndex>
<Protection>
<ProtectionHeader SystemID="9A04F079-9840-4286-AB92-E65BE0885F95">mgIAAAEAAQCQAjwAVwBSAE0ASABFAEEARABFAFIAIAB4AG0AbABuAHMAPQAiAGgAdAB0AHAAOgAvAC8AcwBjAGgAZQBtAGEAcwAuAG0AaQBjAHIAbwBzAG8AZgB0AC4AYwBvAG0ALwBEAFIATQAvADIAMAAwADcALwAwADMALwBQAGwAYQB5AFIAZQBhAGQAeQBIAGUAYQBkAGUAcgAiACAAdgBlAHIAcwBpAG8AbgA9ACIANAAuADAALgAwAC4AMAAiAD4APABEAEEAVABBAD4APABQAFIATwBUAEUAQwBUAEkATgBGAE8APgA8AEsARQBZAEwARQBOAD4AMQA2ADwALwBLAEUAWQBMAEUATgA+ADwAQQBMAEcASQBEAD4AQQBFAFMAQwBUAFIAPAAvAEEATABHAEkARAA+ADwALwBQAFIATwBUAEUAQwBUAEkATgBGAE8APgA8AEsASQBEAD4AKwBwAG4AaQBJADAALwBVAFMAUQBLAE0AOAA2AGMATwB5AGcAaQArAGwAZwA9AD0APAAvAEsASQBEAD4APABDAEgARQBDAEsAUwBVAE0APgArAFUASgB0ACsATgBrADAAMQBSAGcAPQA8AC8AQwBIAEUAQwBLAFMAVQBNAD4APABMAEEAXwBVAFIATAA+AGgAdAB0AHAAOgAvAC8AcwBsAGQAcgBtAC4AbABpAGMAZQBuAHMAZQBrAGUAeQBzAGUAcgB2AGUAcgAuAGMAbwBtAC8AYwBvAHIAZQAvAHIAaQBnAGgAdABzAG0AYQBuAGEAZwBlAHIALgBhAHMAbQB4ADwALwBMAEEAXwBVAFIATAA+ADwALwBEAEEAVABBAD4APAAvAFcAUgBNAEgARQBBAEQARQBSAD4A</ProtectionHeader>
</Protection>
</SmoothStreamingMedia>

*/

/*

<WRMHEADER xmlns="http://schemas.microsoft.com/DRM/2007/03/PlayReadyHeader" version="4.0.0.0"><DATA><PROTECTINFO><KEYLEN>16</KEYLEN><ALGID>AESCTR</ALGID></PROTECTINFO><KID>+pniI0/USQKM86cOygi+lg==</KID><CHECKSUM>+UJt+Nk01Rg=</CHECKSUM><LA_URL>http://sldrm.licensekeyserver.com/core/rightsmanager.asmx</LA_URL></DATA></WRMHEADER>

http://sldrm.licensekeyserver.com/core/rightsmanager.asmx?wsdl

*/


var q2 = nitro.newQuery();
q2.add('media_set',mediaSet)
	.add('version_pid',pid)
	.add('format','xml'); // or base64

nitro.make_request('open.live.bbc.co.uk','/axs/open/authxml','',q2,
	{headers:{Accept: 'text/html,application/xhtml+xml,application/xml'}},function(obj){
	console.log('Converted from XML');
	console.log(JSON.stringify(xmlToJson.xml2json(obj),null,2));
});

