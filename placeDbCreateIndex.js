/*

Þessi skrifta býr til Elasticsearch index fyrir manntalið 1703

*/

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: 'localhost:9200'
});

client.indices.create({
	index: 'placedb',
	body: {
		mappings: {
			place: {
				properties: {
					location: {
						type: 'geo_point'
					},
					names: {
						type: 'nested'
					},
					region: {
						type: 'nested'
					},
					id: {
						type: 'nested',
						properties: {
							region: {
								type: 'nested'
							}
						}
					}
				}
			}
		}
	}
}, function() {
});
