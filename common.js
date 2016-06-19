/*

programmes API common functions

*/

var http = require('http');
var util = require('util');
var debuglog = util.debuglog('bbc');

module.exports = {

	process_pid: function (type,parent,obj,updateSeries,upcoming,callback) {
		processPid(type,parent,obj,updateSeries,upcoming,callback);
	},
	pid_list: function (type,obj,single,updateSeries,upcoming,callback) {
		pidList(type,obj,single,updateSeries,upcoming,callback);
	}

};

//---------------------------------------------------------------------internal functions

var series_cache = [];

function processPid(type,parent,obj,updateSeries,upcoming,callback) {

	if ((obj.type == 'brand') || (obj.type == 'series')) {
		if (updateSeries) {
			callback(obj);
		}
	}

	if (obj.episodes) {
		if (obj.episodes.length) {
			for (var i in obj.episodes) {
				ep = obj.episodes[i].programme;
				debuglog(ep);
				if ((ep.type == 'episode') || (ep.type == 'clip')) {
					callback(ep);
				}
				else {
					console.log('\nUnexpected type... '+ep.type);
					console.log(ep);
				}
			}
		}
		else console.log('\empty '+type+' '+obj.pid);
	}
	else if (obj.programme) {
		obj = obj.programme;
		debuglog(obj);
		if ((obj.type=='episode') || (obj.type=='clip')) {
			callback(obj);
		}
		else if ((obj.type == 'brand') || (obj.type == 'series')) {
			if (updateSeries) {
				callback(obj);
			}
			process.stdout.write('>');
			if (parent.pid!=obj.pid) {
				console.log('\nRecursing from '+type+':'+parent.pid+' to '+obj.type+':'+obj.pid);
				pid_list(obj.type,obj,true,updateSeries,callback);
			}
		}
		else {
			console.log('Unexpected type...');
			console.log(obj);
		}
	}
	else if (obj.version) {
		console.log();
		for (var i in obj.version.contributors) {
			cont = obj.version.contributors[i];
			console.log(' '+(cont.character_name ? cont.character_name : cont.role)+' - '+
				cont.name);
		}
		for (i in obj.version.broadcasts) {
			debuglog(obj.version.broadcasts[i]);
		}
		for (i in obj.version.availabilities) {
			debuglog(obj.version.availabilities[i]);
		}
		debuglog(obj.version.parent);
		ep = obj.version.parent.programme;
		ep.duration = obj.version.duration; //?
		callback(ep);
	}
	else if (obj.broadcasts) {
		var seen = [];
		for (var b in obj.broadcasts) {
			var broadcast = obj.broadcasts[b];
			var programme = broadcast.programme;
			debuglog(programme);
			if ((programme.type=='episode') || (programme.type=='clip')) {
				if (seen.indexOf(programme.pid)<0) {
					seen.push(programme.pid);
					callback(programme);
				}
			}
			else if ((programme.type == 'brand') || (programme.type == 'series')) {
				if (updateSeries) {
					callback(programme);
				}
				process.stdout.write('>');
				if (parent.pid!=programme.pid) {
					console.log('\nRecursing from '+type+':'+parent.pid+' to '+programme.type+':'+programme.pid);
					pid_list(programme.type,programme,true,updateSeries,callback);
				}
			}
			else {
				console.log('Unexpected type...');
				console.log(obj);
			}
		}
	}
	else {
		console.log('Nothing found in this '+type);
		console.log(JSON.stringify(obj));
	}
}

function pidList(type,obj,single,updateSeries,upcoming,callback) {
	// single PID      http://www.bbc.co.uk/programmes/b009szrh.json
	// brand or series http://www.bbc.co.uk/programmes/b012qq56/episodes/player.json

	debuglog(obj);
	if ((obj.type == 'brand') || (obj.type == 'series') || (obj.type == 'toplevel')) {
		if (updateSeries) {
			callback(obj);
		}
	}

	if (series_cache.indexOf(obj.pid)<0) {
		//console.log('Processing '+obj.type+' '+obj.pid);
		process.stdout.write('.');

		if (single) {
			path = '/programmes/'+obj.pid+'.json';
		}
		else if (upcoming) {
			path = '/programmes/'+obj.pid+'/episodes/upcoming.json';
		}
		else {
			path = '/programmes/'+obj.pid+'/episodes/player.json';
		}

		var options = {
		  hostname: 'www.bbc.co.uk'
		  ,port: 80
		  ,path: path
		  ,method: 'GET'
		  ,headers: { 'Content-Type': 'application/json' }
		};

		var list = '';
		var child;

		var req = http.request(options, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (data) {
			   list += data;
		  });
		  res.on('end', function() {
			   try {
					child = JSON.parse(list);
					//debuglog(child);
					if (type=='toplevel') {
						debuglog(child);
						if (child.programme && child.programme.versions) {
							debuglog('  versions:');
							debuglog(child.programme.versions);
						}
					}
					series_cache.push(obj.pid);
					processPid(type,obj,child,updateSeries,upcoming,callback);
			   }
			   catch(err) {
					if ((res.statusCode>=400) && (res.statusCode<600)) {
						if (!single) {
							pidList(type,obj,true,updateSeries,upcoming,callback);
						}
						else {
							console.log(res.statusCode+' '+res.statusMessage);
						}
					}
					else {
						console.log('Something went wrong parsing the '+type+' JSON');
						console.log(res.statusCode+' '+res.statusMessage);
						console.log(err);
						console.log(obj);
						console.log(options.path);
						console.log(list);
					}
				}
		   });
		});
		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		req.end();
	}
}