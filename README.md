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

Til að sækja manntalið 1703 (sem notað er í þessum dæmum):

`node fetchManntal.js --manntal=1703 --outputFile=data/manntal1703.json`

## Setja upp index

Næst þarf að setja upp index í Elasticsearch. Index hegðar sér svipað og tafla í hefðbundnum gagnagrunnnum á borð við MySQL.

Eftirfarandi skrifta býr til index sem heitir `manntal`.

`node manntalCreateIndex.js`

## Hnitsetning á bæjum og innkeyrsla gagna

Eins og er er bara til skrifta til að keyra inn manntalið 1703. Það er vegna þess að í því manntali eru tilgreindir hreppar sem hægt er að tengja við þá hreppa sem finnast í bæjarnafnaskrá Landsbókasafns.

Til að keyra inn bæi:

`node esImport1703.js --inputFile=data/manntal1703.json`

## Uppsetning  Kibana

Kibana keyrir á porti 5601. Þegar það hefur verið sett upp er farið inn á vefslóðina http://localhost:5601

Í þessari gagnahirslu er skrá sem heitir `kibana-objects.json`. Hún geymir stillingar fyrir myndbirtingu gagnanna. Til að hlaða þeirri skrá inn í Kibana er farið í Management og Saved objects. Þar er smellt á Import tengil við hliðina  Saved Objects fyrirsögninni og skráin valin. Loks er smellt á Import takkann neðst á síðunni.

Þegar þessu er lokið er hægt að fara í Dashboard hluta Kibana og sjá yfirlit yfir gögnin.
