const fs = require('fs');
const _ = require('underscore');
const parser = require('xml-js');
const Levenshtein = require('levenshtein');
const distance = require('@turf/distance');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node addStadfongToPlacesDb --stadfongFile --placesDbFile');

	return;
}

// Opna staðaskrá
let placesDbContent = fs.readFileSync(argv.placesDbFile, {
	encoding: 'utf8'
});
let placeDb = JSON.parse(placesDbContent);

// Opna staðföng
let stadfongFileContent = fs.readFileSync(argv.stadfongFile, {
	encoding: 'utf8'
});
let stadfong = JSON.parse(stadfongFileContent);

let counter = 1;

return;
fs.writeFile(argv.placesDbFile, JSON.stringify(placeDb, null, 2), 'utf8', function(writeError) {
	if (writeError) {
		console.log(writeError);
	}

	console.log('Staðarskrá uppfærð')
});