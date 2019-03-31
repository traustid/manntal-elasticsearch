const fs = require('fs');
const _ = require('underscore');
const parser = require('xml-js');
const Levenshtein = require('levenshtein');
const turf = require('@turf/turf');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node addJohnsenToPlacesDb --johnsenFile --placesDbFile --sysla=[takmarka gagnamengi við ákveðna sýslu]');

	return;
}

// Opna staðaskrá
let placesDbContent = fs.readFileSync(argv.placesDbFile, {
	encoding: 'utf8'
});
let placeDb = JSON.parse(placesDbContent);

// Opna Johnsen
let johnsenFileContent = fs.readFileSync(argv.johnsenFile, {
	encoding: 'utf8'
});
let johnsenData = JSON.parse(johnsenFileContent);

// Takmarka Johnsen skrána við ákveðið sýslunúmer
if (argv.sysla) {
	johnsenData = _.filter(johnsenData, function(item) {
		return item.syslunr == argv.sysla;
	});
}

let findJohnsenPlace = function(place) {
	return _.find(johnsenData, function(johnsenPlace) {
		return _.filter(place.id, function(filterPlace) {
			if (filterPlace.region) {
				return _.filter(filterPlace.region, function(filterRegion) {
					return filterRegion.type == 'county' && filterRegion.region == johnsenPlace.sysla;
				}).length > 0
			}
		}).length > 0 && place.name == johnsenPlace.baer;
	});
}

function pad(n, length) {
	var len = length - (''+n).length;
	return (len > 0 ? new Array(++len).join('0') : '') + n
}

placeDb.forEach(function(item) {
	let place = findJohnsenPlace(item);

	if (place) {
		console.log(item.name+' = '+place.baer);

		item.id = _.reject(item.id, function(idItem) {
			return idItem.source == 'jardabok_johnsen';
		});

		let johnsenId = [place.syslunr, place.hreppsnr, place.baernr].join('-');

		item.id.push({
			id: 'ST-'+pad(place.baernr, 3),
			id2: johnsenId,
			name: place.baer,
			source: 'jardabok_johnsen',
			region: [
				{
					region: place.syslunr,
					name: place.sysla,
					type: 'county'
				},
				{
					region: place.hreppsnr,
					name: place.hreppur,
					type: 'municipality'
				}
			]
		});
	}
});

fs.writeFile(argv.placesDbFile, JSON.stringify(placeDb, null, 2), 'utf8', function(writeError) {
	if (writeError) {
		console.log(writeError);
	}

	console.log('Staðarskrá uppfærð')
});