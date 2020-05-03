/*

Lists Nitro categories, formats (known to the BBC as aggregations)

*/

const http = require('http');
const https = require('https');

function category_dump(obj) {
	console.log('# Category list dump');
	var first = true;
	for (var i in obj.results) {
		c = obj.results[i];
		console.log(c.id+' '+c.type+' '+c.pip_id+' = '+c.title);
		if (c.category_type == 'genre' || c.category_type == 'format') {
			for (var j in c.narrower) {
				n = c.narrower[j];
				console.log('  '+n.id+' '+n.type+' '+c.key+'/'+n.key+' = '+n.title);
				if (j.narrower && j.narrower.length>0) {
					console.log('Recursive');
				}
			}
		}
		else {
		  console.log('?? '+c.type);
		}
	}
}

function list_categories(path) {
	var options = {
	  hostname: 'rms.api.bbc.co.uk'
	  ,port: 443
	  ,path: path
	  ,method: 'GET'
	  ,headers: { 'Content-Type': 'application/json' }
	};

	var list = '';
	var cat;

	var req = https.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		   list += data;
	  });
	  res.on('end', function() {
		   try {
				cat = JSON.parse(list);
				category_dump(cat);
		   }
		   catch(err) {
			   if ((res.statusCode>=400) && (res.statusCode<600)) {
				   console.log(res.statusCode+' '+res.statusMessage);
			   }
			   else {
					console.log('Something went wrong parsing the category/format JSON');
					console.log(err);
					console.log('** '+list);
			   }
		   }
	   });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	  console.log(e);
	});
	req.end();
}

//------------------------------------------------------------------------[main]

// was http://polling.bbc.co.uk/radio/categories.json
// was http://clifton.api.bbci.co.uk/aps/programmes/genres.json
// was http://clifton.api.bbci.co.uk/aps/programmes/formats.json
// https://rms.api.bbc.co.uk/categories
// https://rms.api.bbc.co.uk/v2/categories/container

var type = 'genre';
if (process.argv.length>2) {
	type = process.argv[2];
}
if (type.startsWith('genre')) {
	list_categories('/categories');
}
else if (type.startsWith('format')) {
	list_categories('/aps/programmes/formats.json');
}
else {
	console.log('Unknown type: genres|formats');
}

