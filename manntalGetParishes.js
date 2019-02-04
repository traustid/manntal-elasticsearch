var fs = require('fs');
var _ = require('underscore');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node manntalAnalyseParishes --manntalFile --outputFile --sysla=[sýslunafn, takmarka við ákveðna sýslu');

	return;
}

fs.readFile(argv.manntalFile, function(err, data) {
	var manntal = JSON.parse(data);

	var parish = {
	};

	_.each(manntal, function(item) {
		if (argv.sysla && argv.sysla != item.SysluNafn) {
			return;
		}
		else {
			if (!parish[item.SysluNafn]) {
				parish[item.SysluNafn] = [];
			}

			if (!_.find(parish[item.SysluNafn], function(parish) {
				return parish == item.SoknarNafn;
			})) {
				parish[item.SysluNafn].push(item.SoknarNafn);
			}
		}
	});

	if (argv.outputFile) {
		fs.writeFile(argv.outputFile, JSON.stringify(parish, null, 2), 'utf8', function(writeError) {
			if (writeError) {
				console.log(writeError);
			}
		});
	}

	console.log(parish);
});
