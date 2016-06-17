/*
Nitro API helper functions
*/

function query() {
	this.querystring = '';
	this.add = function(param,value,previous) {
		this.querystring += (this.querystring || previous===true ? '&' : '?')+param;
		if (value) this.querystring += '=' + encodeURIComponent(value);
		return this;
	};
	this.reset = function() {
		this.querystring = '';
		return this;
	};
	this.clone = function() {
		var newQ = new query();
		newQ.querystring = this.querystring;
		return newQ;
	}
}

module.exports = {
	newQuery : function(param,value,previous) {
		q = new query();
		if (param) q.add(param,value,previous);
		return q;
	},
	queryFrom : function(url,previous) {
		q = new query();
		if (url.indexOf('?')>=0) {
			url = url.split('?')[1];
		}
		else if (url.indexOf('&')>=0) {
			url = url.split('&')[1];
		}
		q.querystring = ((previous ? '&' : '?')+url);
		return q;
	},
	add : function(q,param,value,previous) {
		return q.add(param,value,previous);
	},
	getQueryString : function(q) {
		return q.querystring;
	},
	clone : function(q) {
		return q.clone();
	},
	iso8601durationToSeconds : function(input) {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0, totalseconds;

		if (reptms.test(input)) {
			var matches = reptms.exec(input);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
			totalseconds = hours * 3600 + minutes * 60 + seconds;
		}
		return totalseconds;
	},
	nitroRawEpisode : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/episodes/'+pid;
	},
	nitroRawEpisodeGenreGroups : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/episodes/'+pid+'/genre_groups';
	},
	nitroRawEpisodeFormats : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/episodes/'+pid+'/formats';
	},
	nitroRawEpisodeAncestors : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/episodes/'+pid+'/ancestors';
	},
	nitroRawMasterBrand : function(mbid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/master_brands/'+mbid;
	},
	nitroRawBrand : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/brands/'+pid;
	},
	nitroRawBrandFranchises : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/brands/'+pid+'/franchises';
	},
	nitroRawPromotion : function(pid, version) {
		if (!version) version = 1;
		return '/nitro/api/v'+version+'/promotions/'+pid;
	}
};