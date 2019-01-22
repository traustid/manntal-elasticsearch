var request = require('request');
var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node fetchData --manntal --outputFile');

	return;
}

var currentPage = 1;
var pageSize = 50;

var baseUrl = 'http://apis.skjalasafn.is/manntal/leit/_/'+argv.manntal+'/';

// Get total
request({
	url: baseUrl+'/1/1/false',
	json: true
}, function(error, response, body) {
	var total = body.NumberOfResults;

	var data = [];

	var getPage = function() {
		
		if ((pageSize*currentPage) < total) {
			var url = baseUrl+pageSize+'/'+currentPage+'/false';

			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					data = data.concat(body.SearchResults);

					console.log(data.length);

					currentPage++;
					getPage();
				}
				else {
					console.log(response);

					currentPage++;
					getPage();
				}
			});
		}
		else {
			fs.writeFile(argv.outputFile, JSON.stringify(data, null, 2), 'utf8', function(writeError) {
				if (writeError) {
					console.log(writeError);
				}
			});
		}
	}

	getPage();
});