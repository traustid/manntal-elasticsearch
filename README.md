# Yfirlestur manntalsgagna í Elasticsearch

Þessi gagnahirsla inniheldur skriftu til að keyra gögn úr manntölum yfir í Elasticsearch. Skrifturnar sækja gögnin og finna hnit fyrir bæi í manntalinu 1703 ásamt því að keyra þau inn. Hér er miðað við Elasticsearch 6.5.4.

Til að keyra skrifturnar þarf Node.js að vera uppsett ásamt Elasticsearch. Þessar skriftur nota bæjarskrá frá Landsbókasafni Íslands. Greiningarkerfið Kibana er notað til að birta tölfræði upp úr gögnunum og koma upplýsingar um það síðar.

## Undirbúningur

Fyrst þarf að sækja gagnahirsluna og setja upp nauðsynlega Node.js pakka:
```
git clone https://github.com/traustid/manntal-elasticsearch.git
cd manntal-elasticsearch
npm install
```

## Sækja manntalsgögn

Skriftan `fetchManntal.js` sækir manntöl úr API frá Þjóðskjalasafni og vistar heildargagnansafnið í eina JSON skrá.

Til að sækja manntalið 1816:

`node fetchManntal.js --manntal=1816 --outputFile=data\manntal1816.json`

## Setja upp index

Næst þarf að setja upp index í Elasticsearch. Index hegðar sér svipað og tafla í hefðbundnum gagnagrunnnum á borð við MySQL.

Eftirfarandi skrifta býr til index sem heitir `manntal`.

`node createIndex.js`

## Hnitsetning á bæjum og innkeyrsla gagna

Eins og er er bara til skrifta til að keyra inn manntalið 1703. Það er vegna þess að í því manntali eru tilgreindir hreppar sem hægt er að tengja við þá hreppa sem finnast í bæjarnafnaskrá Landsbókasafns.

Til að keyra inn bæi:
`node esImport1703.js --inputFile=data\manntal1703.json`
