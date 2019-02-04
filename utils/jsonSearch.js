const fs = require('fs');
const _ = require('underscore');

if (process.argv.length < 4) {
	console.log('node jsonSearch.js [input json file] [search query (fieldname1:value1;fieldname2:value2;[...])]');

	return;
}

fs.readFile(process.argv[2], function(err, fileData) {
	let data = JSON.parse(fileData);

	let properties = {};

	_.each(process.argv[3].split(';'), function(field) {
		let fieldQuery = field.split(':');

		properties[fieldQuery[0]] = fieldQuery[1];
	});

	console.log('Search in: '+process.argv[2]);
	console.log('\nQuery:');
	console.log(properties);
	console.log('\nResult:');

	let searchResults = _.filter(data, properties);

	console.log(JSON.stringify(searchResults, null, 2));
});