/*

get_iplayer related functions

*/

var fs = require('fs');

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
		download_history.sort(); // so we can binary search it later
		console.log('There are '+download_history.length+' entries in the download_history');
		return download_history;
	},
	binarySearch: function (list, item) {
		var min = 0;
		var max = list.length - 1;
		var guess;

		while (min <= max) {
			guess = Math.floor((min + max) / 2);

			if (list[guess] === item) {
				return guess;
			}
			else {
				if (list[guess] < item) {
					min = guess + 1;
				}
				else {
					max = guess - 1;
				}
			}
		}

		return -1;
	}

};
