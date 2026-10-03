# CLAUDE.md — Coach & Chef

Lees dit volledig voordat je iets aanraakt. Daarna `TAKEN.md` voor wat er moet gebeuren.

## 1. Wat is Coach & Chef

**Eten en bewegen. Zeg wat je deed, krijg antwoord, motivatie, inzicht en advies.**

Coach & Chef helpt je gezonder te eten en meer te bewegen. Praat of typ wat je deed, en het staat erin. De coach motiveert, geeft inzicht in je week en adviseert over eten en bewegen. Chef zorgt voor het juiste eten op het juiste moment, ook rond je training. Eenvoudig in gebruik, zonder gedoe.

Hoofdfuncties:
- **Praten of typen**: zeg wat je deed of at, en het staat erin. De coach praat terug.
- **Coach**: motiveert, adviseert, denkt mee over dag en week.
- **Planning aanpassen**: coach stelt voor, gebruiker kiest *Pas aan* of *Laat staan*.
- **Inzicht**: week in beeld, patronen, voortgang van vezels, eiwit en water.
- **Chef**: recepten op maat (rond training, snel, comfort, uit voorraad).
- **Foto's**: recept, voorraad of gerecht fotograferen; Chef leest het uit.
- **Boodschappenlijst en kookmodus**: lijst uit geplande recepten; stap voor stap koken, ook handsfree.
- **Privé**: gegevens op de telefoon, privacymodus, versleutelde cloudkopie.

Gebruiker: Jim. Primair op iPhone (Safari), in het Nederlands. Loopt (hoofdsport), thuisgym met bankje en dumbbells, fietst indoor, wandelt met hond Otis. Vezelfocus (dagdoel 30 g).

## 2. Werkwijze — de zeven regels (niet onderhandelbaar)

1. **Voorzichtig en degelijk.** Lees eerst de betrokken code (grep, dan gericht lezen). Begrijp waarom iets is zoals het is voordat je het verandert. Kleine, gerichte wijzigingen. Bij twijfel: vragen, niet gokken.
2. **Altijd het grote plaatje.** Elke wijziging geldt voor de hele app. Als je een knop, vinkje, kaart of tekststijl aanpast, zoek alle andere plekken waar hetzelfde patroon voorkomt en trek ze gelijk. Iets werkt en ziet er overal hetzelfde uit.
3. **Eenvoud, visueel, gebruiksgemak voorop.** Minder knoppen, minder tekst, per scherm één hoofdactie. Een slimme functie die het scherm voller maakt, is geen verbetering. Liever iets weghalen dan toevoegen.
4. **Let op de kleine dingen.** Tekst verticaal en horizontaal gecentreerd in knoppen. Knoppen in een rij even hoog en uitgelijnd. Geen afgebroken of afgekapte labels. Consistente afstanden. Tikgebied minimaal 44 px.
5. **Altijd een backup bij een nieuwe versie.** Zie §5.
6. **Test zo efficiënt mogelijk.** Jim heeft beperkte middelen. Zie §6: geen volledige testrondes bij elke kleine wijziging.
7. **Laat geen onnodige code achter.** Vervangen functie = oude weg. Geen dubbele definities, geen uitgecommentarieerde blokken, geen `console.log`, geen nieuwe CSS die oude regels alleen maar overstemt als je de oude kunt aanpassen of verwijderen.

**Wezenlijke aanpassingen** (nieuwe schermindeling, andere routing, nieuwe component): eerst een kort plan met een simpele schets (ASCII mag) aan Jim voorleggen. Pas bouwen na akkoord.

## 3. Architectuur

**Eén bestand**: `health-coach-v1.0.html` in de repository `jmrovers1970/paasbrunch1` (~700 KB, ~9.500 regels). Live via GitHub Pages: `https://jmrovers1970.github.io/paasbrunch1/health-coach-v1.0.html`. Geen build, geen npm, geen frameworks. Alles inline: HTML, één groot `<script>`, CSS.

**De bestandsnaam blijft altijd `health-coach-v1.0.html`.** Jim heeft die link op zijn beginscherm; een nieuwe naam breekt de app voor hem. De versie zit in `APP_VERSION`, de geschiedenis in git.

**De repository is openbaar** (GitHub Pages op een gratis account vereist dat). Er mogen dus nooit sleutels, tokens of persoonsgegevens in code, commits of testbestanden staan.

**Versie**: constante `APP_VERSION = 'lime-YYYYMMDD-N'` bovenin het script. Getoond in Instellingen. Elke nieuwe versie: datum van vandaag en N doornummeren. Huidige basis: `lime-20261003-20`.

### CSS — twee lagen
- **Oude laag**: eerste `<style>` in `<head>`. Historisch gegroeid, veel `!important`. Ongebruikte regels zijn al verwijderd; de rest wordt deels overstemd. Niet uitbreiden.
- **Ontwerpsysteem**: `<style id="cc-design-v1">` aan het eind van `<head>`. **Alle nieuwe en aangepaste stijl hier.** Mag je de bijbehorende oude regel veilig verwijderen, doe dat dan in plaats van te overstemmen.
- Specificiteit: binnen tabs wordt het ID verdubbeld (`#tab-vandaag#tab-vandaag .x`) om de oude laag te winnen. Nieuwe componenten krijgen eigen `cc-`-klassen en beginnen met `all:unset` (zie `.cc-chip`), zodat oude stijlen niet doorlekken. Let op: bij `all:unset` op `.parent button` moet een variantklasse ook de parent noemen (`.parent .variant`), anders verliest hij van de reset.

### Ontwerptokens (gebruik deze, verzin geen nieuwe kleuren of maten)
```
--cc-lime #d7f653      lime = "doe dit" (één hoofdactie per scherm) én "gelukt" (vinkjes, voortgang, actieve tab)
--cc-lime-soft #f1f8d2 zacht lime vlak (icoonrondjes, tikfeedback)
--cc-coach #4ccbe2     turquoise zone bovenaan Coach (Chef-zone = --cc-lime)
--cc-petrol #0e3b47    tekst in beide zones
--cc-ink #22312a       tekst, donkere secundaire knop (verzenden)
--cc-green #2f4a3c     tekstlinks, "+ Toevoegen", focusrand
--cc-muted #5f6e65     subtekst
--cc-line #e3e8df      randen    --cc-tint #ecf0e8 zachte vulling    --cc-track #e1e7da voortgangsspoor
--cc-bg #f6f6f1        pagina    --cc-card #fffffd kaart
Afronding: 12 px element, 18 px kaart, 999 px pil/rond.
Lettermaten: 28 / 20 / 16 / 14 / 12. Ruimte: 4 / 8 / 16 / 24 / 32.
Lettertype: -apple-system, 'SF Pro Text', system-ui, sans-serif.
```

### Zones bovenaan
Kop + begroeting + invoer van Coach is turquoise, kop + invoer + knoppen van Chef is lime (`.brand-header` via `body:has(#tab-recepten.active)`). Een zone zet `--cc-zone` en herdefinieert `--cc-ink`, `--cc-green` en `--cc-muted` naar `--cc-petrol` (één tekstkleur voor beide zones); alles erin (ook tekst in witte knoppen, verzendknop, antwoord, links) volgt vanzelf. Gebruik in een zone dus altijd de tokens, nooit vaste grijzen. Op lime valt lime weg: een gekozen Chef-knop is gevuld met de inkt en heeft lime tekst; de "&" in de kop is bij Chef turquoise (spiegelt Coach: lime "&" op turquoise). De microfoon blijft lime (staat in de witte pil). `theme-color` volgt de tab (`switchTab`).

### Vaste patronen (hergebruik, niet opnieuw uitvinden)
- **Invoerbalk** (Coach en Chef): witte pil met lime ronde microfoon (52 px), tekstveld, camera-icoon (44 px), donkere ronde verzendknop. Zodra er tekst staat, neemt een ✕ (`.cc-clear`, `ccClearInput`) de plek van de camera over. Tijdens opname wordt de microfoon een pil "Stop opname" (`[aria-pressed="true"]`). Opnieuw inspreken vervangt de tekst; er wordt nooit automatisch verstuurd.
- **Brede ingang** `.cc-entry`: witte pil 44 px met label en chevron, opent een venster. Chef *Uit je voorraad*. Coach heeft twee halve ingangen naast elkaar (`.cc-entry-half`, icoon + label, geen chevron): *Plan vandaag* en *Ideeën* (voorbeeldvragen); bij privacymodus erachter een ronde donkere slot-knop (`#cc-privacy-badge`, 44 px).
- **Compacte tegel** (Water, Gevoel, Voeding): één rij van 44 px, links een labelkolom van 72 px (`.cc-water-label`: kop + waarde), rechts de bediening. Gevoel: vijf gezichtjes (`CC_MOODS`, `ccSetMood`, slaat `checkIn` van vandaag op, nog een tik wist). Voeding: twee ringen van 44 px (`renderNutriBar`), tik opent de details.
- **Chips** `.cc-chip`: 36–40 px hoog, wit, rand `--cc-line`, tekst 14 px/600, gecentreerd, geen afbreking.
- **Status**: rondje 28 px. Leeg = gepland. Lime met donker vinkje = gedaan/gegeten. Geldt voor beweging, eten, en alle `input[type=checkbox]` (globale regel in cc-design-v1).
- **Kaart**: wit, 1 px rand, 18 px afronding, geen schaduw. Twee niveaus koppen: sectiekop `.cc-section-head` met `.cc-section-title` (20 px/700, gewone hoofdletters: *Jouw dag*, *Jouw week*, *Jouw keuken*) en optioneel rechts `.cc-section-meta` (Jouw dag: "3 van 4 gedaan", `ccRenderDayMeta`); kop in een kaart of groep: 13 px hoofdletters, `--cc-muted` (`vandaag-section-h`).
- **Lijstkaart** `.cc-list` met rijen `.cc-row` (`ccRow(label, meta, actie)`): 56 px, label 16/600 links, meta 14 muted rechts, chevron (`CC_CHEVRON`), ingesprongen scheidingslijn. Elke rij opent een venster; niets klapt inline open. Sectie `.cc-section` met kop `vandaag-section-h`. Voorbeelden: Chef › *Jouw keuken* (`ccRenderKitchen`), Coach › *Jouw week* (`ritmeRenderSummary`).
- **Vensters** (`showModal`): kop met titel en sluiten (44 px). Eén niveau terug met `ccOpenFrom(terugFunctie, () => openVenster())`; formulieren sluiten met `ccGoBack()` zodat je terugkomt waar je vandaan kwam. Focus gaat naar de titel en terug naar de knop die opende; Escape sluit.
- **Weekmenu**: één venster voor Chef en Coach, `ccOpenWeekMenu(offset)`; toevoegen per dag via `showTypedMealSlot(datum)` → `quickEditMeal`.
- **Dagregel** `.cc-line`: statusknop (`.cc-status-btn` met `.cc-status`) + `.cc-line-open` (naam 16/600, subregel 14 muted, één regel). Kop `.cc-day-head` met *＋ Toevoegen* (`.cc-add`). Gebruikt in het weekmenu en in Coach › Beweging (`flowActivities`, max. 3 + *Alles bekijken*) en Eten (`flowRenderMeals`, maaltijden en snacks, met vezels in de subregel). Leeg: `.cc-day-empty`.
- **Na loggen** `.log-feedback`: witte kaart (zoals de voorstelkaart) met pillen *Wijzigen* / *Ongedaan maken*. Knoppen onder een antwoord: `.cc-reply-tools` met witte pillen `.cc-reply-btn` (voorlezen, Meer detail, Opslaan) en duimpjes `.cc-fb`.
- **Voorstelkaart** `.cc-proposal`: kop "VOORSTEL", titel, subregel, reden; knoppen *Pas aan* (lime) en *Laat staan* (omlijnd); daarna status + *Ongedaan maken*.

### Data en opslag
- Globale `data`, opgeslagen met `saveLocal()` (alleen lokaal) of `saveAndSync()` (lokaal + Gist). localStorage: `hc_data` (data), `hc_settings` (instellingen incl. sleutels).
- Dag: `data.weken[ISO-week][YYYY-MM-DD] = {activiteiten[], maaltijden{ontbijt,lunch,diner,snack: []}, waterGlazen, checkIn}`.
- `ensureDay(date)` maakt een dag aan en geeft hem terug (schrijven). `flowDay(date)` alleen lezen. `logRecords(data)` = platte lijst registraties.
- Activiteit: `{id,type,naam,detail,duur,afgevinkt}`; types o.a. run, bike, gym, walk, walkdog, swim, other, rest.
- Maaltijd: `{id,naam,vezels:'7g',eiwitten:'20g',gegeten,receptId?}`. Vezels/eiwit als string met `g`; lees met `parseGrams()`.
- Recepten: `data.recepten[]` (`myRecipes()` filtert verwijderde en voorbeeldrecepten).
- Instellingen: `settings`, opslaan via `saveSettingsData()`. Velden uit het instellingenscherm via `RITME_SETTINGS` (id `set-<id>` → key).
- **Sync**: Gist, optioneel versleuteld (`ccEncryptPayload`/`ccDecryptContent`, AES-GCM, PBKDF2). Conflictdetectie via `hc_sync_base_<gistId>` en `ccDataHash()`. Bij onleesbare opslag: `ccStorageBlocked` + herstelmelding, niets overschrijven.
- **Wijzigingen met rollback**: veel bewerkfuncties zijn via `ccWithEdit` (window[name]-wrappers) beschermd: bij een opslagfout wordt `data` teruggezet. Verander je zo'n functie, laat de naam staan.
- **Verouderde antwoorden**: `ccViewRevision` en request-ID's voorkomen dat een laat AI-antwoord een nieuwer scherm overschrijft. Respecteer dat patroon bij nieuwe async-flows.

### AI
- Modellen in constanten: `CC_MODEL_MAIN` (gesprek, recepten), `CC_MODEL_FAST` (Haiku: geheugen, voedingsschatting, uitlezen, beoordelen), `CC_MODEL_DEEP` (weekterugblik, met terugval naar MAIN). Nooit een modelnaam hardcoden.
- Aanroepen: `callAIPlain(prompt, maxTokens, model)`, `callAIFast`, `callAIDeep`, `callAIMessages`, `callAIStream(messages, maxTokens, {signal,onText,tools})`. Fetch via `ccFetch` (timeouts, annuleren).
- Systeemprompt: `buildSystemPrompt(query)` = `CC_SOUL` + `ccVocabNote()` + context: `dagbriefje` (`ccDayBrief`), `planningMetIds` (`ccPlanForTools`), profiel, `patronen`, herinneringen, registraties. **Privacymodus** (`settings.privacyModus`) stuurt alleen vandaag mee. Wijzig dit gedrag niet ongevraagd.
- **Chef-stijl** staat in `CHEF_STIJL` (bron: Jims document *Receptinspiratie*, okt 2026): sportief en trendy, gezond zonder dieetgedoe; bowl/wrap/bakplaat/één pan; maaltijd 30–45 g eiwit, snack 5–20 g; groente voorop met contrast; meestal 5–20 min; gram/ml en Nederlandse supermarkt; korte pakkende namen. Chef-knoppen: `CC_CHEF_MODES` (Bij sport: voor/tijdens/na; Maaltijd: makkelijk/uitgebreid/comfort).
- Geheugen: alleen letterlijke eigen uitspraken (`_updateCoachMemory`, Haiku, max. 2 per bericht; medisch alleen op verzoek; nooit in privacymodus). Spreekt een nieuwe uitspraak een bestaande tegen, dan vervangt hij die (`vervangt` in het antwoord; melding toont "vervangt: …"). `ccActiveMemory` stuurt relevante herinneringen mee en blijvende voorkeuren/doelen/schema altijd (max. 8, nieuwste eerst). Beheer: Instellingen › Wat Coach onthoudt (`ccMemoryPanel`: één lijst, tik = aanpassen of vergeten; *Alles vergeten* = `ccForgetAllMemory`, doelen en logboek blijven).
- Coach-voorstellen: `CC_PROPOSAL_TOOLS` (verplaats/wijzig/voeg toe/schrap) → `ccValidProposals` → `ccRenderProposals` → `ccApplyProposal`. Nooit iets wijzigen zonder tik van de gebruiker.
- Slim invoeren: `submitSmartInput` → `parseSmartInput` (één aanroep haalt alle acties uit tekst) → daarna eventueel `coachFrontSend`.
- Spraak in: `bigPraatStart` (Coach) en `flowListen` (velden, Chef), beide `continuous=false`, tekst eerst in het veld. Vóór de microfoon start: `ccPrepareMic()` (stopt voorlezen, zet de audiosessie op opnemen). `bigPraatStart` heeft een waakhond die afbreekt als er niets binnenkomt.
- Spraak uit: `ccCreateSentenceSpeaker` (per zin, OpenAI of browserstem) alleen als de beurt ingesproken was (`ccSpokenTurn`). Afspelen loopt via **Web Audio**: `ccGetAudioCtx`, `ccUnlockAudioCtx` (binnen een tik), `ccPlayBlob`, `ccAudioSessionType('auto' | 'play-and-record')`. Het `<audio>`-element is alleen een vangnet. **Maak `<audio>` nooit weer de hoofdroute**: op iOS houdt het de audiosessie vast en krijgt de microfoon daarna geen geluid meer ("Geen spraak ontvangen"). iOS-audio vrijgeven met `ccPrimeAudio()` tijdens de tik.
- Testset in de app: Instellingen › *Coach testen* (`ccOpenEval`): 14 vaste vragen met nepdata (2 over het geheugen, met `geheugen` in de testcase; overgeslagen in privacymodus), Haiku beoordeelt met het dagbriefje erbij (datum en weekdag staan vast; `ccJudgeParse` leest het oordeel, ook voor Chef testen). Een run noteert of privacymodus aan stond. Raakt echte data niet aan. Uitslag 3 okt (privé, versie 12): 7 goed, 3 matig, 2 fout; beide fouten lagen bij de beoordelaar. *Chef testen* (`ccOpenChefEval`): 5 vaste receptvragen, meet tijd tot eerste recept en beoordeelt volgens `CHEF_STIJL`. Uitslag fase 2: eerste recept na 13 s in plaats van 65 s; daarna 4 van 5 goed.

### Belangrijke schermen en functies
- Tabs: `#tab-vandaag` (Coach), `#tab-recepten` (Chef); `switchTab(name, btn)`.
- Coach: invoer, *Plan vandaag* (`limePlanDay`), coachgesprek (`#coach-front-chat`, `addFrontBubble`), kop *Jouw dag* met tegels (`RITME_TILES`, `ritmeSelected`, `ritmeRenderTiles`): beweging (ⓘ per activiteit: `ccActivityHelp`/`ccShowActivityHelp`), eten, water (`ccRenderWater`), gevoel (`ccRenderMood`), voeding. Nieuwe tegels komen één keer bij een eigen indeling via `RITME_NEW_TILES`. Onderaan *Jouw week*: Weekoverzicht (meta: minuten bewogen), Weekmenu, Bewaarde tips (alleen als er tips zijn).
- Weekoverzicht (`ritmeOpenInsights`): bovenaan minuten bewogen (`ccMoveHtml`, `ccMin`, `ccDayMinutes`; alleen afgevinkte activiteiten met duur, wandelen met Otis telt mee), staafje per dag (tik opent de dag) of per week bij 4 weken, balk naar het weekdoel (`ccMoveGoal`, `data.doelen` type `beweging_week`, standaard 150 min, Beweegrichtlijn), daaronder *Per sport* als lijstkaart. De coach krijgt de minuten van deze week in het dagbriefje.
- Vezels: `ccFiberHtml(units, terug)` (zelfde kaart als bewegen; staafje per dag, stippellijn = doel; `ccDayFood`, `ccFoodAvg`, `ccLast7`). In het venster Voeding (`showNutritionDetails`: vandaag met ringen `ccNutriRing` + afgelopen 7 dagen) en in het Weekoverzicht voor de gekozen periode. Een dag zonder log telt niet als 0. De coach krijgt het 7-daags gemiddelde mee.
- Chef: `flowRenderChef`, modus `flowChefMode` (`CC_CHEF_MODES`: voor/tijdens/na/makkelijk/uitgebreid/comfort/voorraadsnack/voorraad) via `flowSetChefMode`, versturen `flowChefSubmit`, genereren `_doGenerateRecepten` → `requestChefRecipes`: één gestreamde aanroep (`callAIStream` met eigen `system`), elk af recept direct in beeld via `chefPreviewOpen`/`chefPreviewAdd`. Receptinstellingen: `flowSetPersons`, `flowSetCount`, `flowSetDieet` (bewaard in localStorage). Foto's: `flowPhotoMenu`, `flowChoosePhoto`, `flowAnalyseRecipePhoto`, `analyseVoorraadFoto`, verkleinen `ccPreparePhoto`. Voorraad: rij *Uit je voorraad* bovenaan opent `showVoorraadModal` (lijst `data.chefVoorraad.items`, aantikken `toggleVoorraad`, starten `voorraadMaak`). Onderaan *Jouw keuken*: Mijn recepten (`ccOpenRecipes` → `flowRecipeList`), Weekmenu (`ccOpenWeekMenu`), Boodschappen, Receptinstellingen (`ccOpenRecipeSettings`). Boodschappen: `showShoppingList`, `_renderShopPicker`, `_buildAndShowShopList`, `_toggleShopMeal`, `ritmeCheckShopping`. Kookmodus: `enterKookmodus`, `ccCook*`.
- Instellingen: `openSettings`, `saveSettings`. Bovenaan één kaart (`.cc-set-row`): naam, AI-sleutel, voorlezen, privacymodus. Daaronder *Meer instellingen*, inklapbaar (`ccToggleSetMore`); elke rij opent een pagina in hetzelfde scherm (`ccSetPage(id)`, terug met ‹): Over jou, Doelen (bewegen per week, vezels, eiwit), Stem en spraak, Wat Coach onthoudt, Coach-tegels, Synchronisatie, Testen, Kopie en opnieuw, Uitleg over de app. Alle velden blijven in de DOM; één *Bewaar* bewaart alles (verborgen op pagina's zonder velden).
- Opening: `#intro-overlay` (`showIntro`, `flowCheckIntro`, `flowDismissIntro`). Bij elke start, tot *Niet meer tonen* (`hc_intro_hide`). Terug te vinden via Instellingen › Uitleg over de app.
- Eerste keer: opening → wizard in `#setup-overlay` (`ccWizStart('first'|'again')`, `ccWizRender`, `ccWizFinish`): naam (+ kopie terugzetten), sporten (chips), doelen (steppers), eten (Alles/Vis/Vega + liever niet → `settings.lieverNiet`, gaat mee naar Chef via `_dieetRegel` en naar de coach), AI-sleutel/voorlezen/privacy, klaar met voorbeelden. Opnieuw te starten via Instellingen › Opnieuw instellen (logboek blijft).
- Voorbeeldvragen: `CC_EXAMPLES` ({kop, sub, icon, items}: Loggen, Advies, Inzicht, Plannen; in het venster als kaart met icoon en tekstballonnen), venster via Coach › *Ideeën* (`ccOpenExamples`, tik zet de tekst in de invoer: `ccUseExample`); ook in de opening en aan het eind van de wizard.

## 4. Vaste regels voor code

- **Veiligheid**: alle tekst van gebruiker of AI die in `innerHTML` komt, door `escapeText()`. Ook in attributen. Nooit API-sleutels in code, logs of commits.
- **Tekst in de UI**: Nederlands, kort, direct, informeel ("je"). Geen jargon. Knoplabels 1–3 woorden.
- **Toegankelijkheid**: echte `<button>`, `aria-label` bij icoonknoppen, `aria-pressed`/`aria-expanded` waar het een toestand is, zichtbare focus, respecteer `prefers-reduced-motion`.
- **iPhone eerst**: test op 390 px breed. Rekening houden met Safari: geluid/microfoon alleen na een tik, spraakherkenning stopt na stilte, `-webkit-appearance` nodig.
- **Geen nieuwe externe afhankelijkheden.**

## 5. Versies en backup

Per opdracht of samenhangende batch:
1. **Backup vóór je begint**: tag de huidige stand (`git tag lime-20261002-2` of de actuele versie) en push de tag. Dat is het terugvalpunt.
2. Werk op een **branch** (bijv. `fase-1`). Pas samenvoegen met `main` als Jim akkoord is, want `main` is meteen live.
3. Bestandsnaam blijft `health-coach-v1.0.html`; alleen `APP_VERSION` ophogen.
4. Commitbericht: versie + wat er veranderd is in één regel.
5. Sluit af met een korte lijst voor Jim: wat is veranderd, wat moet hij op de iPhone controleren. Tip voor Jim: open de live link met `?v=<versie>` erachter om een oude, bewaarde versie te omzeilen.

## 6. Efficiënt testen (beperkte middelen)

Doe per wijziging alleen wat nodig is, in deze volgorde:
1. **Syntax** van het script (bijv. met `node` + `acorn`): altijd, kost niets.
2. **Gerichte logica-test** voor wat je veranderde (jsdom, met `fetch` en spraak gestubd): alleen voor gedrag.
3. **Eén schermafbeelding** op 390×844 van het aangepaste scherm (Playwright/Chromium): alleen bij visuele wijzigingen. Kijk bewust naar uitlijning, centrering, afbreking.
4. **Brede controle** (alle schermen) alleen aan het eind van een batch of na grote CSS-ingrepen.

Niet doen: de echte API aanroepen in tests (stub altijd), volledige testrondes na elke kleine wijziging, lange logs teruglezen. Wat je niet kunt testen (microfoon, geluid, iOS-gedrag), meld je aan Jim als controlepunt.

## 7. Klaar betekent

- Het werkt, op elke plek waar het patroon voorkomt.
- Het ziet er overal hetzelfde uit en is uitgelijnd.
- Er is niets bijgekomen dat niet nodig is; vervangen code is weg.
- Versie opgehoogd, backup aanwezig, korte overdracht aan Jim.
