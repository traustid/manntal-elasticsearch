const fs = require('fs');
const _ = require('underscore');
const parser = require('xml-js');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node lbsXmlToJson --inputFile --placesOutputFile --regionsOutputFile');

	return;
}

let fileContent = fs.readFileSync(argv.inputFile, {
	encoding: 'utf8'
});

let json = JSON.parse(parser.xml2json(fileContent, {
	compact: true
}));

console.log(json);

let listPlace = json.TEI.teiHeader.fileDesc.sourceDesc.listPlace.place;

let placeDb = {
	places: [],
	regions: []
};

let regionDb = [];

//listPlace = listPlace.slice(0, 150);

listPlace.forEach(function(place) {
	if (place.placeName) {
		if (place.placeName.settlement) {
			let placeObj = {
				uid: placeDb.places.length+1,
				names: [],
				region: [],
				location: {},
				id: [],
				type: null
			}

			if (place._attributes['xml:id']) {
				placeObj.id.push({
					id: place._attributes['xml:id'],
					source: 'lbs'
				});
			}

			placeObj.names.push({
				name: place.placeName.settlement._text,
				source: 'lbs'
			});
			placeObj.name = place.placeName.settlement._text;

			if (place.placeName && place.placeName.settlement && place.placeName.settlement._attributes &&  place.placeName.settlement._attributes.type) {
				placeObj.type = place.placeName.settlement._attributes.type;
			}

			if (place.location && place.location.geo) {
				let geo = place.location.geo._text.split(' ');
				placeObj.location = {
					lat: geo[0],
					lng: geo[1]
				};
			}

			if (place.placeName && place.placeName.country) {
				placeObj.country = place.placeName.country._attributes.key;
			}

			if (place.placeName.region && place.placeName.region.length > 0) {
				placeObj.region = place.placeName.region.map(function(region) {
					if (region._attributes.key) {
						let regionObj = {
							region: region._attributes.key.replace('#', ''),
							type: region._attributes.type
						};

						if (region._attributes.when) {
							regionObj.when = region._attributes.when;
						}

						return regionObj;
					}
					else {
						console.log(region);
					}
				});
			}

			placeDb.places.push(placeObj);
		}
		else {
			if (place.placeName.region && place.placeName.region.length > 0) {
				let regionObj = {
					regions: []
				};

				place.placeName.region.forEach(function(region) {
					if (region._text) {
						regionObj.name = region._text;
						regionObj.id = place._attributes['xml:id']
						regionObj.type = region._attributes.type;
					}
					else {
						regionObj.regions.push({
							id: region._attributes.key.replace('#', ''),
							type: region._attributes.type
						});
					}
				});

				if (!_.find(placeDb.regions, function(region) {
					return region.if == regionObj.id;
				})) {
					placeDb.regions.push(regionObj);
				}
			}
		}
	}
});

if (argv.placesOutputFile) {
	fs.writeFile(argv.placesOutputFile, JSON.stringify(placeDb.places, null, 2), 'utf8', function(writeError) {
		if (writeError) {
			console.log(writeError);
		}
	});
}

if (argv.regionsOutputFile) {
	fs.writeFile(argv.regionsOutputFile, JSON.stringify(placeDb.regions, null, 2), 'utf8', function(writeError) {
		if (writeError) {
			console.log(writeError);
		}
	});
}