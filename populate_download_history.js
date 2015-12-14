/*

Re-populates get_iplayer download history from existing files
e.g. if you move computers and fail to bring the download history across

*/

var fs = require('fs');
var rr = require('recursive-readdir');
var common = require('./common');

var download_history = [];
var entries = [];

//_______________________________________________________________
function check(pathspec,pid_pref) {

	var result = false;

	filename = pathspec.split('\\');
	filename = filename[filename.length-1];
	if (filename.indexOf(pid_pref)>=0) {

		result = true;

		name = filename.split(pid_pref);
		desc = name[0].split('_-_');
		series = desc[0];
		episode = desc[1];
		if ((episode) && (episode.charAt(episode.length-1)=='_')) {
			episode = episode.slice(0,episode.length-1);
		}
		if (!episode) {
			episode = series;
		}

		name = name[1].split('.');
		pid = name[0].split('_')[0];
		pid = pid_pref+pid;

		if (common.binarySearch(download_history,pid)<0) {

			suffix = name[1];
			if ((suffix=='mp4') || (suffix=='mov')) {
				type = 'tv';
			}
			else {
				type = 'radio';
			}

			stat = fs.statSync(pathspec);
			var time = Math.floor(stat.mtime.getTime()/1000);

			entry = pid+'|'+series+'|'+episode+'|'+type+'|'+time+
			  '|hlsaacstd1|'+pathspec+'|default,original|1800||||||||||';
			console.log(pid+'|'+series+'|'+episode+'|'+type+'|'+time;
			download_history.push(pid); //tail end is no longer sorted

			entries.push(entry);

		}
		else {
			//console.log('Already in history '+pid+' '+pathspec+' at index '+download_history.indexOf(pid));
		}
	}
	return result;
}

//_____________________________________________________________________________

var dlh_locn;

if (process.argv.length>=3) {
	path = process.argv[2];

	var config = require('./config.json');
	var dlh_locn = config.download_history;
	download_history = common.downloadHistory(dlh_locn);
	console.log('There are '+download_history.length+' entries in the download_history');

	rr(path, function (err, files) {
	  for (var i in files) {
		if (!check(files[i],'b0')) { // Red Bee
			if (!check(files[i],'p0')) { // PIPs
				check(files[i],'w0'); // world service
			}
		}
	  }
	});
}
else {
	console.log('Usage: '+process.argv[1]+' pathspec');
}

process.on('exit',function(code){
	if (entries.length>0) {
		console.log('Writing '+entries.length+' new entries');
		entry_str = '';
		for (var i in entries) {
			entry_str += entries[i]+'\n';
		}
		dlh_fh = fs.openSync(dlh_locn,'a');
		fs.appendFileSync(dlh_locn, entry_str, 'utf8');
		fs.closeSync(dlh_fh);
	}
});