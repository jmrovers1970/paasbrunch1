# TAKEN.md — Coach & Chef afmaken

Basis: `health-coach-v1.0.html`, versie `lime-20261002-2`. Lees eerst `CLAUDE.md`.

Bron: Jims test op de iPhone met echte API. Zijn woorden staan steeds tussen aanhalingstekens; daaronder wat het betekent en wanneer het af is.

**Volgorde**: werk de fasen op volgorde af, één versie per fase. Begin elke fase met reproduceren op 390×844. Vind je de oorzaak niet of hangt het af van iOS, meld dat dan en vraag Jim om het op zijn telefoon te controleren. Fasen 3, 4 (onderdeel B) en 5 zijn wezenlijke aanpassingen: eerst een plan met schets voorleggen.

Let op: Jim testte waarschijnlijk `lime-20261002-1`. Die was gebaseerd op een versie zónder de vinkjes-fix. In `lime-20261002-2` is die fix toegevoegd (globale regel voor `input[type=checkbox]`). Controleer daarom eerst wat in -2 al werkt; claim niets als opgelost wat je niet hebt geverifieerd.

---

## Fase 1 — Wat kapot is (eerst)

### 1.1 Vinkjes werken niet
"Kan aanvinkknoppen veelal niet aanvinken. Zoals bij boodschappen, in instellingen privacymodus, laat coach antwoorden voorlezen."
- Oorzaak in de geteste versie: een oude regel zette `appearance:none` op vinkjes zonder vervangende stijl. Tikken werkte, maar je zag niets veranderen. `lime-20261002-2` heeft een globale regel voor `input[type=checkbox]` (rond, lime met vinkje). Controleer of tikken op de iPhone de toestand verandert én zichtbaar maakt, op álle plekken: Boodschappen (gerechten kiezen, afvinken), Instellingen (voorlezen, privacymodus) en overige.
- Mogelijke oorzaken als het op iOS nog hapert: een overlay of modal die de tik onderschept, een `label` met eigen click-handler, opnieuw renderen bij `change` waardoor de toestand terugspringt, ontbrekende `-webkit-appearance`.
- **Af als**: elk vinkje reageert bij één tik, overal dezelfde ronde stijl, de hele rij is aantikbaar.

### 1.2 Chef-knoppen doen niets
"De knoppen bij de Chef-invoer (Rond sporten, Snel klaar e.d.) doen niks of geven een tekst (uitgegrijsd) in de tekstbalk maar kan je niet verzenden."
- Oorzaak: `flowSetChefMode` zet alleen een placeholder; met een leeg veld blijft verzenden geblokkeerd.
- Een tik op een knop moet direct iets opleveren. Is het veld leeg: start meteen met een standaardvraag voor die modus. Staat er tekst: combineer modus en tekst bij verzenden. Extra vezels/eiwit blijven aan/uit-schakelaars die meegaan met de volgende vraag.
- **Af als**: elke knop zonder typen tot recepten leidt, en de gekozen modus zichtbaar actief is.

### 1.3 Mijn voorraad
"De foto is ingelezen en in de 'wat heb ik in huis'-kaart staan de producten in de invoerbalk. De app geeft wel aan: Chef neemt ze mee. Maar ik zie geen overzicht."
- Oorzaak: `analyseVoorraadFoto` zet de producten als tekst in `#voorraad-input`; er is geen blijvende lijst.
- Maak één bewaarde voorraadlijst: producten als rijen of chips, met verwijderen (×) en een veld om toe te voegen. Foto, inspreken en typen vullen dezelfde lijst aan (zonder dubbelingen). "Uit voorraad" in Chef gebruikt deze lijst.
- **Af als**: na een foto staat er een zichtbaar, bewerkbaar overzicht dat na herladen nog bestaat.

### 1.4 Receptinstellingen reageren niet
"Recepten instellingen reageert niet als ik de aantallen verander."
- Betrokken: `flowSetPersons`, `flowSetCount`, `limeRecipeSummary`, `#chef-personen`. Controleer opslaan, de samenvattingsregel, en of het aantal echt meegaat bij genereren.
- **Af als**: wijzigen direct zichtbaar is in de samenvatting en het volgende resultaat.

### 1.5 Kookmodus: naar een stap springen
"Volgende en vorige kan ik inspreken maar stap 3 bijvoorbeeld niet."
- Breid `ccCookCommand` uit: "stap 3", "stap drie", "ga naar stap 3", "eerste stap", "laatste stap". Nederlandse telwoorden tot minstens twintig.
- **Af als**: elk stapnummer werkt, met cijfer of woord, en een onbestaande stap een korte melding geeft.

### 1.6 Boodschappenlijst
"Kan niet aanvinken/afvinken. Maak van de grote knoppen subtielere rondjes (zoals bij Coach)."
- Valt deels onder 1.1. Controleer ook de overige knoppen in het boodschappenscherm: groot en grof waar het subtiel kan.
- **Af als**: afvinken werkt, ronde vinkjes zoals bij Coach, en de lijst rustig oogt.

---

## Fase 2 — Chef: snelheid en kwaliteit (kritiek)

"KRITIEK: recepten genereren duurt heel lang. Foto uitlezen kost veel tijd (na koelkastfoto, maar ook bij inspreken)." — "Kwaliteit recepten was eerder beter."

- **Meet eerst** waar de tijd zit (per stap: voorbereiden, AI-aanroep(en), verwerken). Verwijder de meetcode daarna.
- `_doGenerateRecepten` werkt in twee stappen ("maken en controleren"). Onderzoek of dat terug kan naar één aanroep, of dat de controle met `CC_MODEL_FAST` kan.
- Laat het eerste recept zo snel mogelijk zien (streaming of eerst één idee, daarna meer op verzoek). Toon direct een rustige laadtoestand.
- Foto's: `ccPreparePhoto` verkleint naar 1600 px; voor voorraad volstaat waarschijnlijk 1024 px en `CC_MODEL_FAST`. Recepten van een foto mogen bij MAIN blijven als de kwaliteit dat vraagt.
- Kwaliteit: vraag Jim om een voorbeeld van "beter". Maak daarna, naar het voorbeeld van *Coach testen*, een kleine vaste receptentest (5 vragen) om voor en na te vergelijken.
- **Af als**: een receptvraag merkbaar sneller een eerste resultaat toont (noem de gemeten tijden voor en na) en de kwaliteit volgens de test niet achteruitgaat.

---

## Fase 3 — Chef eenvoudiger (plan eerst)

"De routing en functionaliteiten op Chef zitten niet goed in elkaar. Te ingewikkeld en wat verwarrend." — "Knoppen voegen weinig toe."

- Breng eerst in kaart: welke wegen leiden naar recepten (typen, inspreken, knoppen, foto, voorraad, weekmenu), en welke schermen en modals daarbij openen.
- Stel een eenvoudiger opbouw voor, bijvoorbeeld: (1) invoer met weinig, duidelijke keuzes, (2) resultaat direct eronder, (3) "Jouw keuken": recepten, weekmenu, boodschappen, voorraad.
- **Rond sporten → Voor / Tijdens / Na.** "Let hier op design. Is een wezenlijke aanpassing." Bijvoorbeeld: een tik op Rond sporten toont drie gelijke segmenten (Voor · Tijdens · Na) op dezelfde plek, een tweede tik start. Geen extra scherm. Het moment gaat mee in de vraag aan Chef.
- Schrap knoppen die weinig toevoegen. Hou over wat echt een ander resultaat geeft.
- **Af als**: Jim het plan heeft goedgekeurd en elke weg naar een recept korter of duidelijker is dan nu.

---

## Fase 4 — Coach opschonen

"Onderaan is te veel. Heel onduidelijk wordt het."

### A. Kleine ingrepen
1. **Inspreken in één keer.** "Ingesproken tekst wordt uitgeschreven en moet ik akkoord op geven. Als die fout is moet ik handmatig weghalen. Kan dat in één keer?" Een duidelijke ✕ in de invoerbalk wist de tekst met één tik, en opnieuw inspreken vervangt de tekst in plaats van eraan toe te voegen. Bespreek met Jim of automatisch versturen na inspreken gewenst is.
2. **"Iets toevoegen" weg.** "Dat doe je al met de tegels Maaltijden en Bewegen."
3. **"Inspiratie & training" weg bij Coach**, of verplaatsen naar waar het past. Leg kort voor wat je kiest.
4. **Oefeningen.** "Weg, of heb je een suggestie?" Voorstel: geen apart oefeningenblok; de uitleg blijft bereikbaar via het ℹ-icoon bij een activiteit.
5. **Vezels en eiwit visueler, lagere tegel.** Bijvoorbeeld twee kleine voortgangsringen naast elkaar met getal en doel.

### B. Hoe voel je je (plan eerst)
"Zeg hoe je je voelt staat onderaan ook niet goed. Wellicht subtiel in het coachvak?" — "Hoe je je voelt onder, en net zo groot als de watertegel. Zo visueel mogelijk."
- Een tegel "Hoe voel je je" in dezelfde vorm en hoogte als de watertegel: één rij met vijf eenvoudige gezichtjes of symbolen, één tik slaat de check-in van vandaag op. De coach krijgt die mee (bestaat al als `checkIn` in de dag).
- Haal de oude check-in onderaan weg. Eén plek, niet twee.

### C. De knop "Plan vandaag"
"De knop plan vandaag –" (Jim maakte de zin niet af.) Vraag Jim wat hem stoort. Bekijk daarbij de hele snelkeuzerij onder de invoer (Plan vandaag, Plan je week, Meer): voegt die genoeg toe, of kan plannen via praten ("plan mijn dag") en het weekoverzicht?

**Af als**: onder de invoer staat alleen wat iets toevoegt, alles is visueel en even hoog waar het naast elkaar staat, en er staat niets dubbel.

---

## Fase 5 — Opening en instellingen (plan eerst)

1. **Opening.** "Standaard starten met de opening: wat doet de app en kan de app. Moet je wel kunnen uitzetten bij volgende keer opstarten, en makkelijk kunnen benaderen."
   - Het openingsscherm bestaat al (`#intro-overlay`, `hc_flow_intro_seen`). Toon het standaard bij elke start, met een vinkje "Niet meer tonen". Altijd terug te vinden via één vaste plek (bijvoorbeeld het vraagteken of Instellingen › Uitleg).
   - Gebruik de teksten uit `CLAUDE.md` §1 (tagline en hoofdfuncties), kort.
2. **Instellingen eenvoudiger.** "Instellingen is wel veel als je dat opent. Schrikt mensen wat af."
   - Bovenaan alleen het belangrijkste: naam, AI-sleutel, voorlezen, privacymodus. De rest (Gist en versleuteling, eigen woorden, patronen, coach testen, export en import) onder één inklapbaar blok "Meer instellingen".
   - Korte uitlegregels, geen lappen tekst.
   - **Af als**: wie Instellingen opent in één oogopslag ziet wat nodig is, en niets verloren is gegaan.

---

## Na elke fase

- Versie ophogen, backup, commit (zie `CLAUDE.md` §5).
- Korte lijst voor Jim: wat is veranderd, en wat hij op de iPhone moet controleren (vooral microfoon, geluid, vinkjes, uitlijning).
- Loop het hele scherm na op de kleine dingen: centrering in knoppen, gelijke hoogtes, uitlijning, geen afgekapte tekst.
