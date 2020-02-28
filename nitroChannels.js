/*

Lists Nitro masterbrands (channels)

*/

function processResponse(obj) {
  for (var m in obj.nitro.results.items) {
    var mb = obj.nitro.results.items[m];
    console.log(mb.mid+','+(mb.url_key||'')+','+(mb.title ? mb.title : (mb.name || ''))+','+mb.partner);
  }
  var dest = {};
  if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
    dest.query = nitro.queryFrom(obj.nitro.pagination.next.href,true);
    dest.path = path;
    dest.callback = processResponse;
  }
  nitro.setReturn(dest);
  return true;
}

var nitro = require('./nitroSdk');
var api = require('./nitroApi/api');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

var path = api.nitroMasterbrands;

var query = nitro.newQuery();
query.add(api.fMasterbrandsPartnerPid,'*',true);

nitro.make_request(host,path,api_key,query,{},processResponse);

process.on('exit', function(code) {
  //console.log('About to exit with code:', code);
});
