const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const host = process.argv[2];
if (host) {
	try {
	let req = https.get('https://'+host+'/',function(res){
		console.log(host,res.statusCode,res.headers["content-type"]);
	});
	req.on('error',function(err){
		console.log(host,err);
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
