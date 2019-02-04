var fs = require('fs');
var _ = require('underscore');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node manntalAnalyseParishes --manntalFile');

	return;
}

fs.readFile(argv.manntalFile, function(err, data) {
	let manntal = JSON.parse(data);

	let syslur = _.uniq(_.pluck(manntal, 'SysluNafn')).sort();

	console.log(JSON.stringify(syslur, null, 2));
});
