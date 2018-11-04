const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const host = process.argv[2];
if (host) {
	try {
	let req = https.get('https://'+host+'/',function(res){
		let data = res.headers["content-type"];
		if ((res.statusCode >= 300) && (res.statusCode < 400)) {
			data = res.headers.location;
		}
		console.log(host,res.statusCode,data);
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
