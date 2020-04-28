const https = require('https');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const colour = process.env.NODE_DISABLE_COLORS ?
    { red: '', yellow: '', green: '', normal: '' } :
    { red: '\x1b[31m', yellow: '\x1b[33;1m', green: '\x1b[32m', normal: '\x1b[0m' };

const host = process.argv[2];
const path = process.argv[3] || '/status';
if (host) {
	let col;
	try {
	let req = https.get('https://'+host+path,function(res){
		let epath = path;
		let ehost = host;
		let eproto = 'https://';
		let data = res.headers["content-type"];
		if ((res.statusCode >= 300) && (res.statusCode < 400)) {
			//data = res.headers.location;
			epath = res.headers.location;
			if (epath.startsWith('http')) {
				eproto = '';
				ehost = '';
			}
		}
		let log = false;
		if (res.statusCode < 400) {
			col = colour.green
			log = true;
		}
                else col = colour.normal;
		console.log(col+eproto+ehost+epath,res.statusCode,data||'',colour.normal);
		if (log) fs.appendFileSync('./valid.txt',eproto+ehost+epath+'\n','utf8');
	});
	req.on('error',function(err){
		//console.log(host,err);
		req.abort();
	});
	req.setTimeout(500, function() {
    		req.abort();
	});
	}
	catch (ex) {
		console.log(host,ex.message);
	}
}
