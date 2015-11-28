/*

ignore multiple pids by adding them to the download cache

*/

var http = require('http');
var fs = require('fs');
var common = require('./common');

var download_history = [];
var newstr = [];
var dlh_locn;

var add_entry = function(ep) {
	if (common.binarySearch(download_history,ep.pid)<0) {
		entry = ep.pid+'|';
		if (newstr.indexOf(entry)<0) {
			entry+=ep.title+'|';
			if ((ep.programme) && (ep.programme.title)) {
				entry += ep.programme.title+'|';
			}
			newstr.push(entry);
		}
	}
};

//-----------------------------------------------------------------------------

function update(pid,quick) {
	obj = [];
	obj.pid = pid; // create a programme object stub
	obj.type = 'toplevel';
	obj.title = '';
	if (quick) {
		add_entry(obj);
	}
	else {
		common.pid_list('toplevel',obj,false,true,add_entry);
	}
}

//-----------------------------------------------------------------------------

function append_newstr() {
	if (newstr.length>0) {
		console.log('Writing '+newstr.length+' entries');
		entry_str = '';
		for (var i in newstr) {
			entry_str += newstr[i]+'\n';
		}
		dlh_fh = fs.openSync(dlh_locn,'a');
		fs.appendFileSync(dlh_locn, entry_str, 'utf8');
		fs.closeSync(dlh_fh);
	}
}

//-----------------------------------------------------------------------------

var quick = false;

if (process.argv.length>2) {

	var configstr = fs.readFileSync('./config.json', 'utf8');
	var config = JSON.parse(configstr);
	dlh_locn = config.download_history;
	download_history = common.downloadHistory(dlh_locn);

	for (var i in process.argv) {
		if (i>1) {
			param = process.argv[i];
			if ((param=='--quick') || (param=='-q')) {
				quick = true;
			}
			else {
				update(param,quick);
			}
		}
	}

}
else {
	console.log('Usage: '+process.argv[1]+' [--quick|-q] pid [pid...]');
}

process.on('exit', function(code) {
  append_newstr();
});