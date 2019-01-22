var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: 'localhost:9200'
});

client.indices.create({
	index: 'manntal',
	body: {
		mappings: {
			person: {
				properties: {
					location: {
						type: 'geo_point'
					}
				}
			}
		}
	}
}, function() {
});
