var fs = require('fs');
var _ = require('underscore');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node jsonCreateDistinct --inputFile --outputFile --fields=[field1;field2;field3]');

	return;
}

fs.readFile(argv.inputFile, function(err, fileData) {
	let data = JSON.parse(fileData);

	let fields = argv.fields.split(';');

	data = _.map(data, function(item) {
		let joinedFieldValues = _.map(fields, function(field) {
			return item[field] || '';
		}).join('-');

		item.__jsonCreateDistinct = joinedFieldValues;

		return item;
	});

	let distinct = _.uniq(data, function(item) {
		return item.__jsonCreateDistinct;
	});

	distinct = _.map(distinct, function(item) {
		delete item.__jsonCreateDistinct;

		return item;
	});

	fs.writeFile(argv.outputFile, JSON.stringify(distinct, null, 2), 'utf8', function(writeError) {
		if (writeError) {
			console.log(writeError);
		};
		console.log('Uniqe entries of '+argv.inputFile+' based on fields '+argv.fields+' written to '+argv.outputFile);
	});
});