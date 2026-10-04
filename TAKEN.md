# TAKEN.md — Chef verbeteren (opdracht voor Sonnet 5.5)

Basis: `health-coach-v1.0.html`, versie `lime-20261004-1`. De vorige takenlijst is af en staat in de git-geschiedenis.

Bron: Jims test op de iPhone (4 okt). Zijn woorden staan tussen aanhalingstekens. Daaronder staat wat er moet gebeuren en wanneer het af is. Ontwerpkeuzes zijn al gemaakt; volg ze en verzin geen eigen variant.

---

## 0. Zo werk je (lees dit eerst)

1. **Lees `CLAUDE.md` helemaal.** Vooral §2 (zeven regels), §3 (tokens, zones, vaste patronen, AI) en §5 (versies). Wat daar staat, geldt hier ook.
2. **Eén taak tegelijk, in de volgorde hieronder.** Per taak: zoek de code met `grep -n`, lees de functie helemaal, verander zo weinig mogelijk, test, ga dan pas verder. Het bestand is groot (ongeveer 9.000 regels, veel code op één regel). Lees gericht met `sed -n 'a,bp'`, nooit het hele bestand.
3. **Bewerk met exacte vervangingen.** Gebruik een klein Python-script met `assert s.count(old)==1` vóór elke `replace`, en lees en schrijf in bytes. Het bestand heeft CRLF-regeleinden; laat die heel (`.replace('\n','\r\n')` bij nieuwe tekst).
4. **Verzin niets wat je niet hebt gecontroleerd.** Zeg alleen "werkt" als je het getest hebt. Wat je niet kunt testen (iPhone, echte API), noem je als controlepunt voor Jim.
5. **Stoppunten.** Bij taak C1 en C9 bouw je niet voordat Jim akkoord is (zie daar). Samenvoegen met `main` alleen na Jims "voeg samen".
6. **Niet aanraken**: de Coach-kant, spraak en geluid (`ccPrepareMic`, Web Audio), privacymodus, sync, `coachFrontSend` en `parseSmartInput`. Nooit een modelnaam hardcoden (gebruik `CC_MODEL_*`). Geen nieuwe externe afhankelijkheden. Alle tekst van gebruiker of AI die in `innerHTML` komt, gaat door `escapeText()`.

### Versie en backup
- Versie: `APP_VERSION = 'lime-YYYYMMDD-N'` (datum van vandaag, N doornummeren). Eén versie per batch.
- Backup: een git-tag pushen lukt in deze omgeving niet (403). Maak vóór het samenvoegen een branch `backup/<huidige live versie>` vanaf `main` via de GitHub-tool `create_branch`.
- Commitbericht: versie + wat er veranderd is, één regel.

### Testen (goedkoop, in deze volgorde)
1. **Syntax**, altijd:
   ```bash
   node -e "const h=require('fs').readFileSync('health-coach-v1.0.html','utf8');const s=/<script>([\s\S]*?)<\/script>/.exec(h)[1];require('/opt/node-tools/node_modules/acorn').parse(s,{ecmaVersion:'latest'});console.log('ok')"
   ```
2. **Gedrag** met Playwright (Chromium staat klaar: `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`, viewport 390×844). Blokkeer het netwerk (`page.route(/^https?:/, r=>r.abort())`). Zet vóór het laden in localStorage: `hc_settings` = `{"anthropicKey":"sk-test","naam":"Jim","setupDone":true,"_profielV2":true}` en `hc_intro_hide` = `1`. **Stub de AI altijd**: overschrijf `window.callAIStream` en `window.callAIPlain` met een functie die vaste JSON teruggeeft. Roep nooit de echte API aan.
3. **Eén schermafbeelding** van het aangepaste scherm op 390×844. Kijk naar uitlijning, centrering, afbreking en gelijke knopbreedte.
4. Aan het eind: open de belangrijkste schermen een keer en controleer dat er geen JavaScript-fouten zijn (`page.on('pageerror')`).

### Overdracht aan Jim (na elke batch)
Kort, in het Nederlands: wat is veranderd, wat hij op de iPhone moet controleren, en de live link met `?v=<versie>` erachter.

---

## Batch 1 — Recepten beter (alleen prompt en kleine code; geen nieuwe schermen)

Alle receptregels staan in `CHEF_STIJL` en `chefRecipePrompt` (zoek `const CHEF_STIJL` en `function chefRecipePrompt`). De regels per knop staan in `_modusRegel` en `CC_CHEF_MODES`. Houd de lijn van Jims document *Receptinspiratie* aan: wat er nu in `CHEF_STIJL` staat, blijft staan. Je vult aan, je schrapt niets.

### B1. Inspiratie: Ottolenghi, Laura's Bakery en foodcreators
"Maak de chef een vazal van Ottolenghi, Veggilaine, Laura's Bakery en beroemde TikTokkers."
- Breid de eerste regel van `CHEF_STIJL` uit met deze bronnen als stijlinspiratie: Ottolenghi (veel kruiden, zuur, granaatappel, tahin, za'atar), Laura's Bakery (gezond bakken en ontbijt, haalbaar), Veggilaine (spelling bij Jim nagaan, schrijf het tot dan zo) en bekende foodcreators op TikTok en Instagram (kleurrijk, één pan of bakplaat, makkelijk na te maken).
- Schrijf erbij: "Gebruik ze als smaak en stijl, kopieer geen recepten en noem geen namen in het recept."
- **Af als**: de regel in `CHEF_STIJL` staat en de prompt geldig blijft (syntaxcheck).

### B2. Praktisch: wat mensen vaak in huis hebben
"Hou rekening met wat men vaak in huis heeft. Kan niet altijd, maar hou het praktisch, wel lekker en eigentijds (TikTok/Insta)."
- Voeg een regel toe aan `CHEF_STIJL`: bouw elk recept op basisvoorraad (eieren, yoghurt of kwark, havermout, rijst, pasta, wraps, bonen of kikkererwten uit blik, tomaten uit blik, ui, knoflook, citroen, diepvriesgroente, kaas, pindakaas, specerijen). Voeg hooguit 3 verse of bijzondere ingrediënten toe die het verschil maken. Liever een slimme twist op iets bekends dan een lijst exotische producten.
- **Af als**: de regel staat in `CHEF_STIJL`.

### B3. Minder rijstcrackers, meer afwisseling
"Er komen erg veel rice-crackers/rijstcrackers in voor."
- Voeg toe aan `CHEF_STIJL`: "Rijstwafels en rijstcrackers alleen als de gebruiker erom vraagt. Wissel de basis af (brood, wrap, havermout, yoghurt, kwark, fruit, smoothie, ei, peulvruchten) en gebruik binnen één reeks voorstellen nooit twee keer dezelfde basis."
- **Af als**: de regel staat er, en een gestubde test laat zien dat de prompttekst (uit `chefRecipePrompt('',2,[],true).prompt`) "Rijstwafels" en "nooit twee keer dezelfde basis" bevat.

### B4. Eerlijke bereidingstijden
"Stel tijden niet te optimistisch voor. Zorg dat het realistisch is."
- **Prompt**: vervang in `CHEF_STIJL` de regel "Snel waar het kan: de meeste recepten in 5–20 minuten." door: "Snel waar het kan, maar eerlijk: tel wassen, snijden, oven voorverwarmen, koken en rusten mee, en reken voor een thuiskok, niet voor een chef. Twijfel je, rond dan naar boven af. Een ovenrecept duurt minstens 25 minuten."
- **Code** (vangnet): maak in `validateChefRecipe` een correctie, niet een fout. Tel alle minuten die in de bereidingsstappen staan (patroon `(\d+)\s*(?:–|-|tot)?\s*(\d+)?\s*min`; neem bij een bereik het hoogste getal). Is die som plus 5 minuten groter dan `parseInt(r.tijd)`, zet dan `r.tijd = (som + 5) + ' min'`. Zet de functie niet om naar een foutmelding; recepten moeten blijven doorkomen.
- **Af als**: een test met een recept met `tijd:"10 min"` en stappen "Rooster 20 min op 220 °C" en "Laat 5 min rusten" uitkomt op `"30 min"`. Een recept zonder minuten in de stappen blijft ongewijzigd.

### B5. Snacks: sportdoel, ook vloeibaar, en leuk
"De snacks moeten aan hun voedingsdoel voldoen, maar ook leuk zijn voor een jonge doelgroep. Een snack kan ook vloeibaar zijn als het maar het sportdoel voldoet."
- Voeg in `_modusRegel` per sportmoment het voedingsdoel toe (kort, zonder medische claims):
  - **voor**: licht verteerbaar, vooral koolhydraten, weinig vet en vezels; snack 30–60 min vooraf.
  - **tijdens**: snelle koolhydraten, vocht en wat zout; meeneembaar, drinkbaar mag.
  - **na**: eiwit 15–25 g plus koolhydraten, binnen een uur.
- Voeg aan alle snackregels toe: "Vloeibaar mag (smoothie, shake, kefir- of yoghurtdrank). Maak het leuk en deelbaar voor een jonge doelgroep: kleurrijk, met een pakkende naam, iets crunchy of een topping, er goed uit zien op een foto. Geen kinderachtige namen."
- **Af als**: de regels staan erin en `chefRecipePrompt` geldige tekst oplevert voor de modi `voor`, `tijdens`, `na` en `voorraadsnack`.

### B6. Venstertitel "Zit hier iets tussen?"
"De kaart die opkomt bij recepten 'Waar heb je zin in?': maak daarvan 'Zit hier iets tussen?'"
- In `chefPreviewOpen`: verander de titel naar `Zit hier iets tussen?`. Laat de subregel staan. Zoek met `grep -n "Waar heb je zin in"` of de tekst nog ergens anders staat en trek die gelijk.
- **Af als**: er nergens meer "Waar heb je zin in" staat en de schermafbeelding de nieuwe titel toont.

### B7. Na Bewaren kunnen doorklikken naar het recept
"Als Chef er 2 geeft, kan ik die inplannen, gegeten aangeven of bewaren. Als ik op Bewaar heb gedrukt, kan ik niet doorklikken en het recept openen. Dat wil ik graag kunnen doen."
- In `bewaarGenRecept`: nu wordt de knop "Bewaard" en uitgeschakeld. Maak er een werkende knop **"Open recept"** van, die het bewaarde recept opent met één niveau terug naar de voorstellen:
  `ccOpenFrom(()=>chefPreviewOpen(false), ()=>flowRecipeDetail(savedId))`, waarbij `savedId` het `id` is dat `retainGeneratedRecipe(r,true)` teruggeeft.
- Laat de melding "bewaard" (banner) staan. Ook als het voorstelvenster opnieuw wordt opgebouwd (`chefPreviewOpen(false)` gebruikt `recipeCardHTML`), moet een al bewaard recept de knop "Open recept" tonen: kijk in `recipeCardHTML` naar `r._savedRecipeId` en of dat recept `bewaard` is.
- **Af als**: in een test met gestubde recepten (1) Bewaar → de knop heet "Open recept", (2) tikken opent `flowRecipeDetail` met de juiste naam, (3) de terugknop of het sluiten van dat venster brengt je terug in de voorstellen, met de knop nog steeds "Open recept".

Na batch 1: versie ophogen, testen, schermafbeelding van het voorstelvenster, overdracht. Niet samenvoegen voordat Jim akkoord is.

---

## Batch 2 — Snack of maaltijd kiezen (nieuwe stap in de bediening)

### C1. Bij Voor en Na eerst kiezen: snack of maaltijd
"Sport voor, tijdens, na geeft maaltijden en snacks. Maar als ik alleen een snack zoek, heb ik niks aan het gerecht, of andersom. Ergens moet ik kunnen kiezen tussen snack en maaltijd."

**Ontwerp (vastgesteld; eerst deze schets en een schermafbeelding aan Jim laten zien, pas bouwen na akkoord):**
```
Tik op [Voor] of [Na]  →  venster (showModal), kop "Voor het sporten" / "Na het sporten"
   ┌──────────────────────────────┐
   │ Voor het sporten          ✕  │
   │ [  Snack  ]   [ Maaltijd  ]  │   ← twee even brede knoppen, 44 px, één tik start Chef
   │ 30–60 min vooraf · 2–3 uur   │   ← één korte subregel per knop, 14 px muted
   └──────────────────────────────┘
Tik op [Tijdens]  →  geen keuze, altijd snack (zoals nu)
```
- Techniek: voeg aan `CC_CHEF_MODES` geen nieuwe knoppen toe in de Chef-zone (die blijft zoals hij is). Bewaar de keuze in een variabele, bijvoorbeeld `flowSportSoort = 'snack' | 'maaltijd'`, zet die vóór `flowSetChefMode(mode, true)`, en gebruik hem in `_modusRegel` voor `voor` en `na`: bij `snack` alleen snacks (voedingsdoel uit B5), bij `maaltijd` alleen maaltijden. Haal de "mix" en het "Bij één recept: kies wat het best past"-stuk dan weg.
- Zet `_type` van het recept op `snack` of `maaltijd` (zie `_type:` in de functie rond `retainGeneratedRecipe`/`validateChefRecipe`), zodat het later goed te filteren is (C9).
- Knoppen in het venster: hergebruik bestaande knopstijlen (`.btn` of `cc-seg`). Geen nieuwe kleuren. Escape en ✕ sluiten zonder iets te starten.
- **Af als**: Voor en Na vragen eerst Snack of Maaltijd; de gegenereerde prompt bevat alleen het gekozen soort; Tijdens start direct; schermafbeelding van het venster op 390 px; niets breekt af.

---

## Batch 3 — Recepten ordenen (eerst plan, dan bouwen)

### C9. Mijn recepten slim ordenen
"Is er een handige manier om de recepten ook slim te organiseren/categoriseren?"

**Voorstel (bouwen pas na Jims akkoord; laat hem eerst deze schets en een mock-schermafbeelding zien):**
- Geen mappen en geen handwerk: elk recept krijgt automatisch een soort bij het bewaren. De Chef-knop zegt al wat het is: `snack`, `maaltijd`, of `sport` (voor/tijdens/na). Sla dat op als `r.soort` en bij sport ook `r.moment`.
- In *Mijn recepten* (`flowRecipeList`) vervangt één rij filters de huidige (`CC_RECIPE_FILTERS`: Alles/Snel/Eiwit/Vezels):
  ```
  [Alles] [Maaltijd] [Snack] [Sport] [Snel]
  ```
  Snel = 20 minuten of korter. Eiwit en vezels staan al als waarden bij elk recept; die filters vervallen.
- Sorteer binnen een filter op "vaak gemaakt": tel hoe vaak een recept is ingepland of als gegeten gemarkeerd. Recepten die je nooit maakte, komen onderaan.
- Bestaande recepten zonder soort: leid af uit `type` (`snack` → Snack, anders Maaltijd) zodat niets verdwijnt.
- **Af als** (na akkoord): elk filter toont de juiste recepten, oude recepten vallen ergens onder, de rij past op 390 px zonder afbreken (alle knoppen even breed), en zoeken werkt nog.

---

## Na elke batch
- CLAUDE.md bijwerken waar iets verandert (basisversie, `CHEF_STIJL`-regels, nieuwe functies of velden).
- Geen achterblijvende oude code (regel 7). Controleer dat functies die je vervangt nergens meer worden aangeroepen.
