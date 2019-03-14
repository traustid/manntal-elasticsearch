/*

Þessi skrifta keyrir manntalið 1703 inn í Elasticsearch,
athugið að fyrst þarf að keyra manntalCreateIndex.js til að búa til
rétta möppun fyrir hnit sem finnats í gögnunum.

*/

var fs = require('fs');
var _ = require('underscore');
var elasticsearch = require('elasticsearch');
var Levenshtein = require('levenshtein');

var argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node placeDbEsImport --inputFile');

	return;
}

console.log('Opna skrá');
fs.readFile(argv.inputFile, function(err, data) {
	console.log('Skrá í json');

	var placeDb = JSON.parse(data);

	var bulkBody = [];

	_.each(placeDb, function(item, index) {
		if (item.location) {
			item.location.lat = Number(item.location.lat);
			item.location.lon = Number(item.location.lng);
			delete item.location.lng;
		}
		bulkBody.push({
			create: {
				_index: 'placedb',
				_type: 'place',
				_id: item.uid
			}
		});
		bulkBody.push(item);
	});

	var client = new elasticsearch.Client({
		host: 'localhost:9200',
		
		log: 'trace'
	});

	console.log('Sendi gögn til es')
	console.log(bulkBody.length/2);
	client.bulk({
		body: bulkBody
	});
});