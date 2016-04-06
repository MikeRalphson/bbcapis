var fs = require('fs');

var baseStr = fs.readFileSync('./iblApi/ibl_swagger_header.json');
var base = JSON.parse(baseStr);

var status = require('./iblApi/ibl_status.json');
var schema = require('./iblApi/ibl.json');

//____________________________________________________________________________
function traverse(obj,parent) {

var result = [];

	var array = Array.isArray(obj);
	for (var key in obj) {
		// skip loop if the property is from prototype
		if (!obj.hasOwnProperty(key)) continue;

		if (key == 'additionalProperties') {
			delete obj[key];
		}
		if (key == 'required') {
			delete obj[key];
		}
		if (key == '$ref') {
			obj[key] = obj[key].replace('/defintions','/definitions'); // reported to ibl-team 06/04/2016
			if (obj[key] == '#/definitions/store_version') {
				parent.items = {};
				parent.items.type = 'string';
			}
			obj[key] = obj[key].replace('/definitions','/definitions/definitions');
		}

		if (typeof obj[key] == 'object') {
			traverse(obj[key],obj);
		}
	}
	return result;
}

//____________________________________________________________________________

console.log('Building swagger for v'+status.version+' release '+status.status.release);
base.info.version = status.version;
base.info["x-release"] = status.status.release;
base.info["x-schema-id"] = schema.id;

delete schema["$schema"];
delete schema.id;
traverse(schema,{});
base.definitions = schema;

fs.writeFileSync('./iblApi/swagger.json',JSON.stringify(base,null,2));