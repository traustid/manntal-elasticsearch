var fs = require('fs');
var _ = require('underscore');

fs.readFile('data/manntal1703.json', function(err, data) {
	var manntal = JSON.parse(data);

//	var counties = _.uniq(_.pluck(manntal, 'SysluNafn'));
	var municipalities = [];

	_.each(manntal, function(item) {
		if (!_.find(municipalities, function(municipality) {
			return municipality.municipality == item.SoknarNafn && municipality.county == item.SysluNafn;
		})) {
			municipalities.push({
				municipality: item.SoknarNafn,
				county: item.SysluNafn
			})
		}
	});

	fs.writeFile('municipalities.json', JSON.stringify(municipalities));

	console.log(municipalities);
});
