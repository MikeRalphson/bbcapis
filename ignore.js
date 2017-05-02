/*

ignore multiple pids by adding them to the download cache

*/

var http = require('http');
var fs = require('fs');
var giUtils = require('./giUtils');
var getopt = require('node-getopt');

var download_history = [];
var newstr = [];
var options = {};
var dlh_locn;

var add_entry = function(ep) {
	if (giUtils.binarySearch(download_history,ep.pid)<0) {
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
	add_entry(obj);
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
var quick = true;

options = getopt.create([
	['q','quick','Add pid without looking it up. Now always true'],
	['h','help','Display this help']
]);
options.bindHelp();

options.on('quick',function(){
	quick = true;
});

var o = options.parseSystem();

var config = require('./config.json');
dlh_locn = config.download_history;
download_history = giUtils.downloadHistory(dlh_locn);

if (o.argv.length>0) {
	for (var i in o.argv) {
		update(o.argv[i],quick);
	}
}
else {
	options.showHelp();
}

process.on('exit', function(code) {
  append_newstr();
});
