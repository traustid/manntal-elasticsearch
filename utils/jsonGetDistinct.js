var fs = require('fs');
var _ = require('underscore');

if (process.argv.length < 3) {
	console.log('node jsonGetDistinct.js [input json file] [field]');

	return;
}

fs.readFile(process.argv[2], function(err, fileData) {
	var data = JSON.parse(fileData);

	var distinct = _.uniq(_.pluck(data, process.argv[3]));

	console.log('Distinct "'+process.argv[3]+'" values:');
	console.log(JSON.stringify(distinct, null, 2));
	console.log('Count '+distinct.length);
});