# Yfirlestur manntala í Elasticsearch

Þessi gagnahirsla inniheldur skriftu til að keyra gögn úr manntölum yfir í Elasticsearch. Hér er miðað við útgáfu 6.5.4. Til að keyra skrifturnar þarf Node.js að vera uppsett.

## Undirbúningur

Fyrst þarf að sækja gagnahirsluna og setja upp nauðsynlega Node.js pakkka:
```
git clone https://github.com/traustid/manntal-elasticsearch.git
cd manntal-elasticsearch
npm install
```

## Sækja manntalsgögn

Skriftan `fetchManntal.js` sækir manntöl úr API frá Þjóðskjalasafni og vistar heildargagnansafnið í eina JSON skrá.

Til að sækja manntalið 1816:

`node fetchManntal.js --manntal=1816 --outputFile=data\manntal1816.json`
