/* genApi - generate simple Javascript API from Swagger spec */

var fs = require('fs');
var helper = require('./apiHelper.js');

var swagger = require('./iblApi/swagger.json');

var out = '';
var map = [];

function uniq(s) {
	var result = s;
	count = 2;
	while (map.indexOf(result)>=0) {
		result = s + count;
		count++;
	}
	return result;
}

var actions = ['get','head','post','put','delete','patch','options','trace','connect'];

for (var p in swagger.paths) {
	var path = swagger.paths[p];
	for (var a in actions) {
		var action = path[actions[a]];
		if (action) {
			out += '\n/* '+action.description+' */\n';
			var pName = (actions[a]+p).toCamelCase();
			var pName = uniq(pName);

			if (p.indexOf('{')>=0) {
				var params = [];
				var p2 = p.replace(/(\{.+?\})/g,function(match,group1){
					params.push(group1.replace('{','').replace('}',''));
					return '';
				});
				pName = (actions[a]+p2).replace('//','/').toCamelCase();
				if (pName[pName.length-1] == '/') pName = pName.substr(0,pName.length-1);
				pName = uniq(pName);

				out += 'function '+pName+'(';
				for (var arg in params) {
					out += (arg > 0 ? ',' : '') + params[arg];
				}
				out += '){\n';
				out += "  var p = '" + swagger.basePath + p + "';\n";
				for (var arg in params) {
					out += "  p = p.replace('{" + params[arg] + "}'," + params[arg] + ");\n";
				}
				out += '  return p;\n';
				out += '}\n';
			}
			else {
				out += 'const '+pName+" = '"+swagger.basePath+p+"';\n";
			}
			map.push(pName);

			for (var sp in action.parameters) {
				var swagParam = action.parameters[sp];
				if (swagParam['in'] == 'query') {
					out += 'const '+pName+('/'+swagParam.name).toCamelCase() + " = '" + swagParam.name + "';\n";
					if (swagParam['enum']) {
						for (var e in swagParam['enum']) {
							var value = swagParam['enum'][e];
							out += 'const '+pName+('/'+swagParam.name+'/'+value).toCamelCase() +
								" = '" + swagParam.name + "=" + value + "';\n";
						}
					}
				}
			}

		}
	}
}

out += '\nmodule.exports = {\n';
for (var m in map) {
	out += '  ' + map[m] + ' : ' + map[m] + ',\n';
}
out += "  host : '" + swagger.host + "'\n";
out += '};\n';
console.log(out);
