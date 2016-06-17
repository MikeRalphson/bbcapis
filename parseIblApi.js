var fs = require('fs');
var validator = require('is-my-json-valid')

var base = require('./iblApi/ibl_swagger_header.json');
var status = require('./iblApi/ibl_status.json');
var schema = require('./iblApi/ibl.json');
var jsonSchema = require('./iblApi/jsonSchema.json');

//____________________________________________________________________________
function traverse(obj,parent) {

var result = [];

	var array = Array.isArray(obj);
	for (var key in obj) {
		// skip loop if the property is from prototype
		if (!obj.hasOwnProperty(key)) continue;

		if (key == 'anyOf') {
			parent["x-anyOf"] = obj[key];
			delete obj[key];
		}

		if (typeof obj[key] == 'object') {
			traverse(obj[key],obj);
		}
	}
	return result;
}

//____________________________________________________________________________

console.log('Validating v'+status.version+' release '+status.status.release);

var validate = validator(jsonSchema);
validate(schema,{
  greedy: true
});
var errors = validate.errors;
if (errors) {
	console.log(errors);
}
else {
	console.log('Building swagger spec');
	base.info.version = status.version;
	base.info["x-release"] = status.status.release;
	base.info["x-schema-id"] = schema.id;

	delete schema["$schema"];
	delete schema.id;
	traverse(schema,{});
	var holding = schema.definitions;
	delete schema.definitions;

	base.definitions = {};
	base.definitions.ibl = schema;
	base.definitions = Object.assign({},base.definitions,holding);

	fs.writeFileSync('./iblApi/swagger.json',JSON.stringify(base,null,2));
}