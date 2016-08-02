var fs = require('fs');
var path = require('path');
var validator = require('is-my-json-valid')
var oa2js = require('openapi2js');

var base = require('./iblApi/ibl_swagger_header.json');
var status = require('./iblApi/ibl_status.json');
var schema = require('./iblApi/ibl.json');
var jsonSchema = require('./validation/jsonSchema.json');
var swaggerSchema = require('./validation/swagger2Schema.json');

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
			if (parent.required) {
				parent["x-originalRequired"] = parent.required;
				delete parent.required;
			}
			if (parent.additionalProperties === false) {
				parent.additionalProperties = true;
			}
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
  greedy: true,
  verbose: true
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

	console.log('Validating swagger spec...');
	var validate = validator(swaggerSchema);
	validate(base,{
		greedy: true,
		verbose: true
	});
	var errors = validate.errors;
	if (errors) {
		console.log(errors);
		console.log('Writing swagger.err file');
		fs.writeFileSync('./iblApi/swagger.err',JSON.stringify(base,null,2));
	}
	else {
		console.log('Writing swagger spec');
		fs.writeFileSync('./iblApi/swagger.json',JSON.stringify(base,null,2));
		console.log('Writing JS API definitions');
		oa2js.openAPI2js(base,'./iblApi/ibl.js');
	}
}