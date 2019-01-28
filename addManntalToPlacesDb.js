const fs = require('fs');
const _ = require('underscore');
const parser = require('xml-js');
const Levenshtein = require('levenshtein');

const argv = require('minimist')(process.argv.slice(2));

if (process.argv.length < 3) {
	console.log('node addManntalToPlacesDb --manntalFile --placesDbFile --datasetName --regionsDbFile --notFoundReport');

	return;
}

let datasetName = argv.datasetName;

let municipalities = {
	manntal1703: [
		{
			municipality: 'Dalahreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Bíldudalshreppur',
			modernCounty: 'Vestur-Barðastrandarsýsla'
		},
		{
			municipality: 'Hvammshreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Arnarneshreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Tálknafjarðarhreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Tálknafjarðarhreppur',
			modernCounty: 'Vestur-Barðastrandarsýsla'
		},
		{
			municipality: 'Miklaholtshreppur',
			county: 'Hnappadalssýsla',
			modernName: 'Miklaholtshreppur',
			modernCounty: 'Hnappadalssýsla'
		},
		{
			municipality: 'Eyrarsveit',
			county: 'Snæfellsnessýsla',
			modernName: 'Eyrarsveit',
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Álftaneshreppur',
			county: 'Gullbringusýsla',
			modernName: 'Bessastaðahreppur',
			modernCounty: 'Gullbringusýsla'
		},
		{
			municipality: 'Ásshreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Áshreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Vestmannaeyjahreppur',
			county: 'Vestmannaeyjar',
			modernName: '',
			modernCounty: ''
		},
		{
			municipality: 'Skeiðahreppur',
			county: 'Árnessýsla',
			modernName: 'Skeiðahreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Fljótahreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Fljótahreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Leiðvallarhreppur',
			county: 'Vestur-Skaftafellssýsla',
			modernName: 'Leiðvallarhreppur',
			modernCounty: 'Vestur-Skaftafellssýsla'
		},
		{
			municipality: 'Biskupstungnahreppur',
			county: 'Árnessýsla',
			modernName: 'Biskupstungnahreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Vatnsleysustrandarhreppur',
			county: 'Gullbringusýsla',
			modernName: 'Vatnsleysustrandarhreppur',
			modernCounty: 'Gullbringusýsla'
		},
		{
			municipality: 'Vatnsneshreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Kirkjuhvammshreppur',
			modernCounty: 'Vestur-Húnavatnssýsla'
		},
		{
			municipality: 'Skeggjastaðahreppur',
			county: 'Múlasýsla',
			modernName: 'Skeggjastaðahreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Norðfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Norðfjarðarhreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Trjekyllisvíkurhreppur',
			county: 'Strandasýsla',
			modernName: 'Árneshreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Svínadalshreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Svínavatnshreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Breiðdalshreppur',
			county: 'Múlasýsla',
			modernName: 'Breiðdalshreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Eyjafjallasveit',
			county: 'Rangárvallasýsla',
			modernNames: [
				'Austur-Eyjafjallahreppur', 'Vestur-Eyjafallahreppur'
			],
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Grímsneshreppur',
			county: 'Árnessýsla',
			modernName: 'Grímsneshreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Torfustaðahreppur',
			county: 'Húnavatnssýsla',
			modernNames: [
				'Fremri-Torfastaðahreppur', 'Ytri-Torfustaðahreppur'
			],
			modernCounty: 'Vestur-Húnavatnssýsla'
		},
		{
			municipality: 'Selvogshreppur',
			county: 'Árnessýsla',
			modernName: 'Ölfushreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Seltjarnarneshreppur',
			county: 'Gullbringusýsla',
			modernName: '',
			modernCounty: ''
		},
		{
			municipality: 'Sveinsstaðahreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Sveinsstaðahreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Saurbæjarhreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Saurbæjarhreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Dyrhólahreppur',
			county: 'Vestur-Skaftafellssýsla',
			modernName: 'Mýrdalshreppur',
			modernCounty: 'Vestur-Skaftafellssýsla'
		},
		{
			municipality: 'Holtamannahreppur',
			county: 'Rangárvallasýsla',
			modernName: [
				'Holtahreppur', 'Ásahreppur'
			],
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Neshreppur',
			county: 'Snæfellsnessýsla',
			modernNames: [
				'Neshreppur', 'Fróðárhreppur', 
			],
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Fáskrúðsfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Fáskrúðsfjarðarhreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Leirár- og Melahreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Leirár- og Melahreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Hörðadalshreppur', // finnst ekki
			county: 'Dalasýsla',
			modernName: '',
			modernCounty: ''
		},
		{
			municipality: 'Mýrahreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Mýrahreppur',
			modernCounty: 'Vestur-Ísafjarðarsýsla'
		},
		{
			municipality: 'Helgastaðahreppur',
			county: 'Þingeyjarsýsla',
			modernNames: [
				'Aðaldælahreppur', 'Reykdælahreppur'],
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Vestur-Landeyjahreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Vestur-Landeyjahreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Barðastrandarhreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Barðarstrandarhreppur',
			modernCounty: 'Vestur-Barðastrandarsýsla'
		},
		{
			municipality: 'Skriðdalshreppur',
			county: 'Múlasýsla',
			modernName: 'Skriðdalshreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Kjósarhreppur',
			county: 'Kjósarsýsla',
			modernName: 'Kjósarhreppur',
			modernCounty: 'Kjósarsýsla'
		},
		{
			municipality: 'Bólstaðarhlíðarhreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Bólstaðarhreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Langadalsströnd',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Nauteyrarhreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Hrafnagilshreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Hrafnagilshreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Rangárvallahreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Rangárvallahreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Breiðuvíkurhreppur',
			county: 'Snæfellsnessýsla',
			modernName: 'Breiðuvíkurhreppur',
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Súðavíkurhreppur',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Súðavíkurhreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Lón Nes og Mýrar',
			county: 'Austur-Skaftafellssýsla',
			modernNames: [
				'Bæjarhreppur', 'Nesjahreppur', 'Mýrahreppur'
			],
			modernCounty: 'Austur-Skaftafellssýsla'
		},
		{
			municipality: 'Hofshreppur',
			county: 'Austur-Skaftafellssýsla',
			modernName: 'Hofshreppur',
			modernCounty: 'Austur-Skaftafellssýsla'
		},
		{
			municipality: 'Kjalarneshreppur',
			county: 'Kjósarsýsla',
			modernName: 'Kjalarneshreppur',
			modernCounty: 'Kjósarsýsla'
		},
		{
			municipality: 'Mosvallahreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Mosvallahreppur',
			modernCounty: 'Vestur-Ísafjarðarsýsla'
		},
		{
			municipality: 'Fljótsdalshreppur',
			county: 'Múlasýsla',
			modernName: 'Fljótsdalshreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Þingeyrarhreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Þingeyrarhreppur',
			modernCounty: 'Vestur-Ísafjarðarsýsla'
		},
		{
			municipality: 'Bæjarhreppur',
			county: 'Árnessýsla',
			modernName: 'Gaulverjabæjarheppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Stokkseyrarhreppur',
			county: 'Árnessýsla',
			modernName: 'Stokkseyrarhreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Syðri Reykjadalshreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Lundarreykjadalshreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Kleifahreppur',
			county: 'Vestur-Skaftafellssýsla',
			modernNames: [
				'Kirkjubæjarhreppur', 'Hörglandshreppur'
			],
			modernCounty: 'Vestur-Skaftafellssýsla'
		},
		{
			municipality: 'Skútustaðahreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Skútustaðahreppur',
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Hvammssveit',
			county: 'Dalasýsla',
			modernName: 'Hvammshreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Lýtingsstaðahreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Lýtingsstaðahreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Villingaholtshreppur',
			county: 'Árnessýsla',
			modernName: 'Villingaholtshreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Borgarhreppur',
			county: 'Mýrasýsla',
			modernName: 'Borgarhreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Vopnafjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Vopnafjarðarhreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Laxárdalshreppur',
			county: 'Dalasýsla',
			modernName: 'Laxárdalshreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Rauðasandshreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Rauðasandshreppur',
			modernCounty: 'Vestur-Barðastrandarsýsla'
		},
		{
			municipality: 'Vallnahreppur',
			county: 'Múlasýsla',
			modernName: 'Vallahreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Hólshreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Bolungarvík',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Grunnavíkursveit', // finnst ekki
			county: 'Norður-Ísafjarðarsýsla',
			modernName: '',
			modernCounty: ''
		},
		{
			municipality: 'Gnúpverjahreppur',
			county: 'Árnessýsla',
			modernName: 'Gnúpverjahreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Súgandafjarðarhreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Suðureyrarhreppur',
			modernCounty: 'Vestur-Ísafjarðarsýsla'
		},
		{
			municipality: 'Álftaneshreppur',
			county: 'Mýrasýsla',
			modernName: 'Álftaneshreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Miðdalahreppur',
			county: 'Dalasýsla',
			modernName: 'Miðdalahreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Höfðastrandarhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Hofshreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Auðkúluhreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Þingeyrarhreppur',
			modernCounty: 'Vestur-Ísafjarðarsýsla'
		},
		{
			municipality: 'Grýtubakkahreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Grýtubakkahreppur',
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Þingvallahreppur',
			county: 'Árnessýsla',
			modernName: 'Þingvallahreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Skriðuhreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Skriðuhreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Gufudalshreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Reykhólahreppur',
			modernCounty: 'Austur-Barðastrandarsýsla'
		},
		{
			municipality: 'Aungulsstaðahreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Öngulstaðahreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Flateyjarhreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Reykhólahreppur',
			modernCounty: 'Austur-Barðastrandarsýsla'
		},
		{
			municipality: 'Svalbarðshreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Svalbarðshreppur',
			modernCounty: 'Norður-Þingeyjarsýsla'
		},
		{
			municipality: 'Fljótshlíðarhreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Fljótshlíðarhreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Engihlíðarhreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Engihlíðarhreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Tungu- og Fellnahreppur',
			county: 'Múlasýsla',
			modernName: 'Fellahreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Reykhólahreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Reykhólahreppur',
			modernCounty: 'Austur-Barðastrandarsýsla'
		},
		{
			municipality: 'Ólafsfjarðarhreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Ólafsfjörður',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Helgafellssveit',
			county: 'Snæfellsnessýsla',
			modernName: 'Helgafellssveit',
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Borgarfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Borgarfjarðarhreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Kolbeinsstaðahreppur',
			county: 'Hnappadalssýsla',
			modernName: 'Kolbeinsstaðahreppur',
			modernCounty: 'Hnappadalssýsla'
		},
		{
			municipality: 'Skarðstrandarhreppur',
			county: 'Dalasýsla',
			modernName: 'Skarðshreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Bitruhreppur',
			county: 'Strandasýsla',
			modernName: 'Fellshreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Norðurárdalshreppur',
			county: 'Mýrasýsla',
			modernName: 'Norðurárdalshreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Andakílshreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Andakílshreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Skutulsfjarðarhreppur',
			county: 'Vestur-Ísafjarðarsýsla',
			modernName: 'Ísafjörður',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Ögursveit',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Ögurhreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Blönduhlíðarhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Akrahreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Þverárhreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Þverárhreppur',
			modernCounty: 'Vestur-Húnavatnssýsla'
		},
		{
			municipality: 'Þorkelshólshreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Þorkelshólshreppur',
			modernCounty: 'Vestur-Húnavatnssýsla'
		},
		{
			municipality: 'Svarfaðardalshreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Svarfaðardalshreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Austur-Landeyjahreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Austur-Landeyjahreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Aðalvíkurhreppur',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Sléttuhreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Skefilsstaðahreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Skefilsstaðahreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Seiluhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Seyluhreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Hvítársíðuhreppur',
			county: 'Mýrasýsla',
			modernName: 'Hvítársíðuhreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Húsavíkurhreppur',
			county: 'Þingeyjarsýsla',
			modernNames: [
				'Húsavík', 'Tjörneshreppur'
			],
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Hrútafjarðarhreppur',
			county: 'Strandasýsla',
			modernName: 'Bæjarhreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Ölfushreppur',
			county: 'Árnessýsla',
			modernName: 'Ölfushreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Reyðarfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Reyðarfjarðarhreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Skilmannahreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Skilmannahreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Skógarstrandarhreppur',
			county: 'Snæfellsnessýsla',
			modernName: 'Skógarstrandarhreppur',
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Reykholtsdalshreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Reykholtsdalshreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Stafholtstungnahreppur',
			county: 'Mýrasýsla',
			modernName: 'Stafholtstungnahreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Borgarhafnarhreppur',
			county: 'Austur-Skaftafellssýsla',
			modernName: 'Borgarhafnarhreppur',
			modernCounty: 'Austur-Skaftafellssýsla'
		},
		{
			municipality: 'Ljósavatnshreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Ljósavatnshreppur',
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Álftafjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Geithellnahreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Skálmarnesmúlahreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Reykhólahreppur',
			modernCounty: 'Austur-Barðastrandarsýsla'
		},
		{
			municipality: 'Hálshreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Hálshreppur',
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Akraneshreppur',
			county: 'Borgarfjarðarsýsla',
			modernNames: [
				'Innri-Akraneshreppur', 'Akranes'
			],
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Torfalækjarhreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Torfalækjarhreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Suðurfjarðahreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Bíldudalshreppur',
			modernCounty: 'Vestur-Barðastrandarsýsla'
		},
		{
			municipality: 'Landmannahreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Landmannahreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Staðarsveit',
			county: 'Snæfellsnessýsla',
			modernName: 'Staðarsveit',
			modernCounty: 'Snæfellsnessýsla'
		},
		{
			municipality: 'Hvolhreppur',
			county: 'Rangárvallasýsla',
			modernName: 'Hvolhreppur',
			modernCounty: 'Rangárvallasýsla'
		},
		{
			municipality: 'Hraungerðishreppur',
			county: 'Árnessýsla',
			modernName: 'Hraungerðishreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Keldunesshreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Kelduneshreppur',
			modernCounty: 'Norður-Þingeyjarsýsla'
		},
		{
			municipality: 'Snæfjallaströnd',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Snæfjallahreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Skorradalshreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Skorradalshreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Svalbarðsstrandarhreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Svalbarðsstrandarhreppur',
			modernCounty: 'Suður-Þingeyjarsýsla'
		},
		{
			municipality: 'Mosfellshreppur',
			county: 'Kjósarsýsla',
			modernName: 'Mosfellsbær',
			modernCounty: 'Kjósarsýsla'
		},
		{
			municipality: 'Hafnahreppur',
			county: 'Gullbringusýsla',
			modernName: 'Hafnahreppur',
			modernCounty: 'Gullbringusýsla'
		},
		{
			municipality: 'Hrunamannahreppur',
			county: 'Árnessýsla',
			modernName: 'Hrunamannahreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Haukadalshreppur',
			county: 'Dalasýsla',
			modernName: 'Haukadalshreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Glæsibæjarhreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Glæsibæjarhreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Ásasveit',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Hálsahreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Hraunhreppur',
			county: 'Mýrasýsla',
			modernName: 'Hraunhreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Þverárhlíðarhreppur',
			county: 'Mýrasýsla',
			modernName: 'Þverárhlíðarhreppur',
			modernCounty: 'Mýrasýsla'
		},
		{
			municipality: 'Sauðaneshreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Sauðaneshreppur',
			modernCounty: 'Norður-Þingeyjarsýsla'
		},
		{
			municipality: 'Rosmhvalaneshreppur',
			county: 'Gullbringusýsla',
			modernNames: [
				'Vatnsleysustrandarhreppur', 'Gerðahreppur'
			],
			modernCounty: 'Gullbringusýsla'
		},
		{
			municipality: 'Grindavíkurhreppur',
			county: 'Gullbringusýsla',
			modernName: 'Grindavík',
			modernCounty: 'Gullbringusýsla'
		},
		{
			municipality: 'Presthólahreppur',
			county: 'Þingeyjarsýsla',
			modernName: 'Presthólahreppur',
			modernCounty: 'Norður-Þingeyjarsýsla'
		},
		{
			municipality: 'Staðarhreppur',
			county: 'Strandasýsla',
			modernName: 'Hólmavíkurhreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Sauðárhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Skarðshreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Vindhælishreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Vindhælishreppur',
			modernCounty: 'Austur-Húnavatnssýsla'
		},
		{
			municipality: 'Strandarhreppur',
			county: 'Borgarfjarðarsýsla',
			modernName: 'Hvalfjarðarstrandarhreppur',
			modernCounty: 'Borgarfjarðarsýsla'
		},
		{
			municipality: 'Grímsey',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Grímseyjarhreppur',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Reynistaðarhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Staðarhreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Viðvíkurhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Viðvíkurhreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Saurbæjarsveit',
			county: 'Dalasýsla',
			modernName: 'Saurbæjarhreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Hólahreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Hólahreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Staðarhreppur',
			county: 'Húnavatnssýsla',
			modernName: 'Staðarhreppur',
			modernCounty: 'Vestur-Húnavatnssýsla'
		},
		{
			municipality: 'Sléttuhlíðarhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Fellshreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Jökuldalshreppur',
			county: 'Múlasýsla',
			modernName: 'Jökuldalshreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Skinnastaðahreppur',
			county: 'Þingeyjarsýsla',
			modernNames: [
				'Fjallahreppur', 'Öxarfjarðarhreppur'
			],
			modernCounty: 'Norður-Þingeyjarsýsla'
		},
		{
			municipality: 'Berunesshreppur',
			county: 'Múlasýsla',
			modernName: 'Beruneshreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Fellsstrandarhreppur',
			county: 'Dalasýsla',
			modernName: 'Fellstrandarhreppur',
			modernCounty: 'Dalasýsla'
		},
		{
			municipality: 'Kaldaðarneshreppur',
			county: 'Strandasýsla',
			modernName: 'Kaldrananeshreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Sandvíkurhreppur',
			county: 'Árnessýsla',
			modernName: 'Sandvíkurhreppur',
			modernCounty: 'Árnessýsla'
		},
		{
			municipality: 'Tröllatunguhreppur',
			county: 'Strandasýsla',
			modernName: 'Kirkjubólshreppur',
			modernCounty: 'Strandasýsla'
		},
		{
			municipality: 'Siglunesshreppur',
			county: 'Eyjafjarðarsýsla',
			modernName: 'Siglufjörður',
			modernCounty: 'Eyjafjarðarsýsla'
		},
		{
			municipality: 'Vatnsfjarðarsveit',
			county: 'Norður-Ísafjarðarsýsla',
			modernName: 'Reykjarfjarðarhreppur',
			modernCounty: 'Norður-Ísafjarðarsýsla'
		},
		{
			municipality: 'Eyjarhreppur',
			county: 'Hnappadalssýsla',
			modernName: 'Eyjahreppur',
			modernCounty: 'Hnappadalssýsla'
		},
		{
			municipality: 'Rípurhreppur',
			county: 'Skagafjarðarsýsla',
			modernName: 'Rípuhreppur',
			modernCounty: 'Skagafjarðarsýsla'
		},
		{
			municipality: 'Geiradalshreppur',
			county: 'Barðastrandarsýsla',
			modernName: 'Reykhólahreppur',
			modernCounty: 'Austur-Barðastrandarsýsla'
		},
		{
			municipality: 'Seyðisfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Seyðisfjarðarhreppur',
			modernCounty: 'Norður-Múlasýsla'
		},
		{
			municipality: 'Mjóafjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Mjóafjarðarhreppur',
			modernCounty: 'Suður-Múlasýsla'
		},
		{
			municipality: 'Loðmundarfjarðarhreppur',
			county: 'Múlasýsla',
			modernName: 'Borgarfjarðarhreppur',
			modernCounty: 'Norður-Múlasýsla'
		}
	]
};

const getModernMunicipality = function(historicMunicipality, historicCounty) {
	let foundMunicipality = _.find(municipalities[datasetName], function(municipality) {
		return municipality.municipality == historicMunicipality && municipality.county == historicCounty;
	});

	return foundMunicipality;
}

let notFound = [];

// Hleð staðarskrá
let regionsDbContent = fs.readFileSync(argv.regionsDbFile, {
	encoding: 'utf8'
});
let regionsDb = JSON.parse(regionsDbContent);

// Fall til að finna nafn svæðis í svæðaskrá
const getDbRegion = function(id, type) {
	return _.findWhere(regionsDb, {id: id, type: type});
}

// Hleð svæðaskrá
let placesDbContent = fs.readFileSync(argv.placesDbFile, {
	encoding: 'utf8'
});
let placeDb = JSON.parse(placesDbContent);

// Opna manntal
let manntalFileContent = fs.readFileSync(argv.manntalFile, {
	encoding: 'utf8'
});
let manntal = JSON.parse(manntalFileContent);

let counter = 1;

manntal.forEach(function(item) {
	console.log(counter+' af '+manntal.length);

	// Leitað að mögulegum stað í staðarskrá
	let possibleMaches = _.filter(placeDb, function(place) {
		// Síum staðarskrá

		// Fallið skilar true ef staður í staðarskrá (place) skilar jákvæðum samanburði við stað í manntali (item)
		return _.find(place.names, function(name) {
			// Finnum hrepp í staðarskrá sem samsvarar hreppi 1703
			let modernMunicipality = getModernMunicipality(item.SoknarNafn, item.SysluNafn);

			// Finnum hreppinn í staðarskrá til að nota síðar til að leita eftir
			let dbMunicipality = _.find(place.region, function(region) {
				return region && region.type ? region.type == 'parish' : false;
			});

			// Finnum nafnið á hreppnum
			let dbMunicipalityName;
			if (dbMunicipality) {
				let dbMunicipalityObject = getDbRegion(dbMunicipality.region, dbMunicipality.type);
				dbMunicipalityName = dbMunicipalityObject ? dbMunicipalityObject.name : undefined;
			}

			// Finnum sýsluna í staðarskrá til að nota síðar til að leita eftir
			let dbCounty = _.find(place.region, function(region) {
				return region && region.type ? region.type == 'county' : false;
			});

			// Finnum nafnið á sýslunni
			let dbCountyName;
			if (dbCounty) {
				let dbCountyObject = getDbRegion(dbCounty.region, dbCounty.type);
				dbCountyName = dbCountyObject ? dbCountyObject.name : undefined;
			}

			// Finnum levenshtein fjarlæðina á milli nafnsins í manntalinu og í staðarskránni
			let nameLevenshtein = new Levenshtein(item.baernafn, name.name);

			if (dbMunicipalityName) {
				let municipalityLevenshtein = new Levenshtein(item.SoknarNafn, dbMunicipalityName);
				return nameLevenshtein.distance < 2 && municipalityLevenshtein.distance < 2;
			}
			else {
				return false;
			}
		});
	});

	if (possibleMaches.length > 0) {
		console.log('-----------------');
		console.log('Leitaði að: '+item.baernafn);
		console.log(item.SoknarNafn);
		console.log(item.SysluNafn);
/*
		console.log(JSON.stringify(possibleMaches.map(function(match) {
			return match.name;
		}), null, 2));
*/
		// Bæta hér við manntals ID við staðarskrá
		possibleMaches.forEach(function(place) {
			place.id.push({
				id: item.Baer,
				source: datasetName,
				dateFrom: 1703,
				dateTo: 1703,
				certainty: 5, // of 10
				name: item.baernafn,
				region: [
					{
						region: item.SysluNafn,
						type: 'county'
					},
					{
						region: item.SoknarNafn,
						type: 'municipality'
					}
				]
			});
		});
	}
	else {
		let notFoundObj = item;

		notFound.push(notFoundObj);

		placeDb.push({
			uid: placeDb.length+1,
			name: item.baernafn,
			type: 'farm',
			country: 'IS',
			names: [
				{
					name: item.baernafn,
					source: datasetName,
					dateFrom: 1703,
					dateTo: 1703
				}
			],
			ids: [
				{
					id: item.Baer,
					source: datasetName,
					dateFrom: 1703,
					dateTo: 1703,
					name: item.baernafn,
					region: [
						{
							region: item.SysluNafn,
							type: 'county'
						},
						{
							region: item.SoknarNafn,
							type: 'municipality'
						}
					]
				}
			]
		});

		console.log('-----------------');
		console.log('Fannst ekki:');
		console.log(item.baernafn);
	}

	counter++;
});

placeDb = placeDb.map(function(place) {
	place.id = _.uniq(place.id, function(id) {
		return id.source+':'+id.id;
	});

	return place;
});

fs.writeFile(argv.placesDbFile, JSON.stringify(placeDb, null, 2), 'utf8', function(writeError) {
	if (writeError) {
		console.log(writeError);
	}

	console.log('Staðarskrá uppfærð')
});

if (argv.notFoundReport) {
	console.log('Skýrsla um staði sem ekki fundust skrifuð í '+argv.notFoundReport);

	fs.writeFile(argv.notFoundReport, JSON.stringify(notFound, null, 2), 'utf8', function(writeError) {
		if (writeError) {
			console.log(writeError);
		}
	});
}
