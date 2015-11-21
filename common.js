/*

common functions

*/

var http = require('http');
var fs = require('fs');
var util = require('util');
var debuglog = util.debuglog('bbc');

module.exports = {

	downloadHistory: function (dlh_locn) {
		var download_history = [];
		var dlh_str = fs.readFileSync(dlh_locn,'utf8');
		var dlh = dlh_str.split('\n');
		for (var i in dlh) {
			temppid = dlh[i].split('|')[0];
			if (temppid.indexOf('vpid/')>=0) {
				temppid = temppid.split('vpid/')[1];
				temppid = temppid.split('.')[0];
			}
			download_history.push(temppid);
		}
		download_history.sort();
		console.log('There are '+download_history.length+' entries in the download_history');
		return download_history;
  },
  process_pid: function (type,parent,obj,callback) {
	processPid(type,parent,obj,callback);
  },
  pid_list: function(type,obj,single,callback) {
	  pidList(type,obj,single,callback);
  }
  
};

//---------------------------------------------------------------------internal functions

var series_cache = [];

function processPid(type,parent,obj,callback) {
	//debuglog(obj);
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
			process.stdout.write('>');
			if (parent.pid!=obj.pid) {
				console.log('\nRecursing from '+type+':'+parent.pid+' to '+obj.type+':'+obj.pid);
				pid_list(obj.type,obj,false);
			}
		}
		else {
			console.log('Unexpected type...');
			console.log(obj);
		}
	}
	else if (obj.version) {
		console.log('Version PIDs are only partially supported');
		for (var i in obj.version.contributors) {
			console.log(obj.version.contributors[i]);
		}
		for (var i in obj.version.broadcasts) {
			console.log(obj.version.broadcasts[i]);
		}
		for (var i in obj.version.availabilities) {
			console.log(obj.version.availabilities[i]);
		}
		console.log(obj.version.parent);
		ep = obj.version.parent.programme;
		ep.duration = obj.version.duration; //?
		callback(ep);
	}
	else {
		console.log('Nothing found in this '+type)
	}
}

function pidList(type,obj,single,callback) {
	// single PID      http://www.bbc.co.uk/programmes/b009szrh.json
	// brand or series http://www.bbc.co.uk/programmes/b012qq56/episodes/player.json

	debuglog(obj);

	if (series_cache.indexOf(obj.pid)<0) {
		//console.log('Processing '+obj.type+' '+obj.pid);
		process.stdout.write('.');

		if (single) {
			path = '/programmes/'+obj.pid+'.json';
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
						console.log(child);
						if (child.programme && child.programme.versions) {
							console.log('  versions:');
							console.log(child.programme.versions);
						}
					}
					series_cache.push(obj.pid);
					processPid(type,obj,child,callback);
			   }
			   catch(err) {
					if ((res.statusCode>=400) && (res.statusCode<500)) {
						if (!single) {
							pidList(type,obj,true,callback);
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