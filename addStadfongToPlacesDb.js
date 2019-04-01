const fs = require('fs');
const _ = require('underscore');
const parser = require('xml-js');
const Levenshtein = require('levenshtein');
const turf = require('@turf/turf');

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

let findStadfang = function(place) {
	return _.find(stadfong, function(stadfang) {
		if (!isNaN(parseFloat(stadfang.LONG_WGS84)) && !isNaN(parseFloat(stadfang.LAT_WGS84))) {
			let distance = turf.distance(turf.point([parseFloat(place.location.lng), parseFloat(place.location.lat)]), turf.point([parseFloat(stadfang.LONG_WGS84), parseFloat(stadfang.LAT_WGS84)]));

			if (distance < 0.1) {
				console.log('distance: '+distance);

				return true;
			}
		}
	});
}

placeDb.forEach(function(item) {
	if (item.location && item.location.lat && item.location.lng) {
		let place = findStadfang(item);

		if (place) {
			console.log(item.name+' = '+place.FASTEIGNAHEITI);

			item.id = _.reject(item.id, function(idItem) {
				return idItem.source == 'fasteignaskra';
			});

			item.id.push({
				id: place.LANDNR,
				name: place.FASTEIGNAHEITI,
				source: 'fasteignaskra'
			});
		}
	}
});

fs.writeFile(argv.placesDbFile, JSON.stringify(placeDb, null, 2), 'utf8', function(writeError) {
	if (writeError) {
		console.log(writeError);
	}

	console.log('Staðarskrá uppfærð')
});