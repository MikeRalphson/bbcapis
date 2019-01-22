const fs = require('fs');
const path = require('path');
const util = require('util');

const ajv = require('ajv')({
	allErrors: true,
	verbose: true,
	jsonPointers: true
});
const oa2js = require('openapi2js');
const yaml = require('js-yaml');
const recurse = require('reftools/lib/recurse.js').recurse;

const base = yrequire('./iblApi/ibl_openapi_header.yaml');
const status = require('./iblApi/ibl_status.json');
const schema = require('./iblApi/ibl.json');
const jsonSchema = require('./validation/jsonSchema.json');
const openapiSchema = yrequire('./validation/openapi3Schema.yaml');

let ajvFormats = require('ajv/lib/compile/formats.js');
ajv.addFormat('uriref', ajvFormats.full['uri-reference']);
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema'; // optional, using unversioned URI is out of spec
let metaSchema = require('ajv/lib/refs/json-schema-v5.json');
ajv.addMetaSchema(metaSchema);
ajv._opts.defaultMeta = metaSchema.id;

//____________________________________________________________________________
function yrequire(filename) {
	const s = fs.readFileSync(filename,'utf8');
	return yaml.safeLoad(s,{json:true});
}

//____________________________________________________________________________

console.log('Validating v'+status.version+' release '+status.status.release);

var validate = ajv.compile(jsonSchema);
validate(schema);
var errors = validate.errors;
if (errors) {
	console.warn(errors);
}
else {
	console.log('Building OpenAPI document');
	base.info.version = status.version;
	base.info["x-release"] = status.status.release;
	base.info["x-schema-id"] = schema.id;

	delete schema["$schema"];
	delete schema.id;
	var holding = schema.definitions;
	delete schema.definitions;

	recurse(holding,{},function(obj,key,state) {
		if ((key === 'type') && (Array.isArray(obj.type))) {
			if ((obj.type.length > 1) && (obj.type[1] === 'null')) {
				obj.type = obj.type[0];
				obj.nullable = true;
			}
		}
		if ((key === '$ref') && (typeof obj.$ref === 'string')) {
			if (obj.$ref.startsWith('#/definitions/')) {
				obj.$ref = obj.$ref.replace('#/definitions/','#/components/schemas/');
			}
		}
	});

	base.components.schemas = Object.assign({},base.components.schemas,holding);

	console.log('Validating OpenAPI document...');
	var validate = ajv.compile(openapiSchema);
	validate(base);
	var errors = validate.errors;
	if (errors) {
		console.warn(util.inspect(errors,{depth:null, colors:true}));
		console.log('Writing openapi.err file');
		fs.writeFileSync('./iblApi/openapi.err',yaml.safeDump(base));
	}
	else {
		console.log('Writing OpenAPI document');
		fs.writeFileSync('./iblApi/openapi.yaml',yaml.safeDump(base));
		console.log('Writing JS API definitions');
		oa2js.openAPI2js(base,'./iblApi/ibl.js');
	}
}
