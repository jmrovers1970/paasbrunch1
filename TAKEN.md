# TAKEN.md — Coach-gesprek en receptenoverzicht

Basis: `health-coach-v1.0.html`, versie `lime-20261005-12` (branch `claude/practical-edison-cvl53y`, backup `backup/lime-20261004-12`). Vorige takenlijsten staan in de git-geschiedenis.

Bron: Jims test op de iPhone (5 okt) met vijf schermafbeeldingen. Zijn woorden staan tussen aanhalingstekens. Jims keuzes op het advies: 1 ja, 2 allebei, 3 "laat maar even", 4 "doe maar helemaal".

---

## Batch 5 okt — af (wacht op Jims controle op de iPhone, daarna samenvoegen)

### K1. Antwoord sprekender — af
"Dat is nu kleine zware tekst op de blauwe achtergrond. Kan dat wat sprekender?"
- Het antwoord staat in een witte kaart (`.cc-reply`), 18 px normaal gewicht. Je eigen vraag staat er klein boven ("Jij: …").
- Eén ✕, rechtsboven in de kaart. De losse grote ✕ en de ✕ bij de geheugenmelding zijn weg.
- Geheugenmelding onderin de kaart, alleen voor de laatste vraag (bleef eerst hangen: "interval" boven een antwoord over wandelen).
- Opslaan en voorlezen zijn ronde icoonknoppen, zodat de knoppen en de duimpjes op één regel passen.

### K2. Meer dialoog en voorbeelden — af
"Hoe kan je meer uitnodigen tot dialoog. Ik zou ook wat meer voorbeeldvragen willen: Ik wil beginnen met een intervaltraining. Hoe doe ik dat?"
- Onder elk antwoord twee vervolgvragen van de coach (tool `vervolgvragen` in dezelfde aanroep, geen extra kosten). Tik = versturen. *Naar Chef* staat als pil in dezelfde rij.
- Zolang er geen gesprek is: drie korte voorbeeldvragen onder de invoer (tik = in de invoer, niet versturen).
- *Ideeën*: nieuwe groep *Trainen* (intervaltraining, opbouw naar 10 km, dumbbells en bankje, warming-up) en extra voorbeelden in de andere groepen (17 in totaal).

### K3. Ingesproken training wijzigen — af
"Als ik een ingesproken training wil wijzigen kan ik niet de andere gegevens (tijd, afstand, met wie)."
- *Wijzigen* opent nu het volledige activiteitformulier (tijdstip, afstand, duur, notitie), hetzelfde als in *Jouw dag*. Na opslaan staat de kaart *Opgeslagen* er opnieuw, met *Ongedaan maken*.
- "Met wie": geen eigen veld (Jim: "laat maar even"). Kan in de notitie.
- Kaart *Opgeslagen*: niet meer dubbel, ✕ in plaats van *Sluiten*, leesbare datum ("6 okt"), duidelijkere melding als ongedaan maken niet meer kan.

### R1. Recepten strakker en overzichtelijker — af
"De recepten database moet strakker en professioneler. Zie nu ontbijtgerechten die ook lunch kunnen zijn. Vooral een lange lijst."
- Twee niveaus: eerst *wanneer* (Alles/Ontbijt/Lunch/Diner/Snack), dan *wat/hoe* (Snel, Vega, Bowl …).
- Bij Alles: *Vaak gemaakt* en per moment de drie meest gemaakte met *Alle N*. Een recept dat bij ontbijt én lunch past, staat bij allebei.
- Elke rij toont tijd, eiwit en vezels.
- Chef zet bij nieuwe recepten voortaan elk moment waarop het past.
- *Labels opruimen*: Chef zet alle bestaande recepten in één keer goed en wijst bijna dubbele recepten aan; terugzetten kan, verwijderen alleen na eigen keuze (herstelbaar).

### Controlepunten voor Jim (iPhone)
1. Coach: vraag iets. Staat het antwoord in een witte kaart met je vraag erboven? Twee vervolgvragen eronder? Tik er een: gaat die als jouw vraag?
2. Spreek een vraag in: leest de coach alleen het antwoord voor, niet de vervolgvragen?
3. Zonder gesprek: drie voorbeeldpillen onder *Plan je dag* / *Ideeën*, schuiven ze netjes?
4. Spreek een training in, tik *Wijzigen*: zie je tijdstip, afstand en duur? Opslaan en daarna *Ongedaan maken*.
5. Chef › Mijn recepten: kies Ontbijt en Lunch, tik een label. Daarna *Labels opruimen* (kost één Haiku-aanroep) en kijk of de indeling klopt.
6. Live link met `?v=lime-20261005-1` erachter.

### Nog open (niet gevraagd of later)
- Veld "Met wie" bij activiteiten (Jim: laat maar even).
- *Coach testen* neemt de vervolgvragen nog niet mee in de beoordeling.

---

## 5 okt — recepten trager, kefir — `lime-20261005-12`
Jim: "Recepten genereren gaat veel langzamer dan gisteren. Kwaliteit is goed (al is kefir wel heel specifiek)."
- Trager komt door hetzelfde als de hotfix hieronder: Sonnet 5.5 dacht eerst na. Met `between_tools` (sinds `-11`) is dat denken uit; verwacht weer ongeveer de snelheid van gisteren.
- Kefir, skyr, tempeh, miso en gochujang tellen nu als bijzonder ingrediënt (hooguit 3 per recept); anders de gewone variant.
- **Controle voor Jim**: tik *Snel* en kijk hoe snel het eerste recept er staat (gisteren ongeveer 13 s). Is het nog steeds traag, dan zet ik het receptmodel terug op Sonnet 4.6 (één regel).

## Hotfix 5 okt — "Geen bruikbaar antwoord ontvangen" — af (`lime-20261005-11`)
Jim (live, iPhone): Coach gaf bij "Ik wil beginnen met intervaltraining" en "Maak een opbouw naar 10 km" alleen "Geen bruikbaar antwoord ontvangen".
- Oorzaak: Sonnet 5.5 (sinds `-2` het MAIN-model) denkt standaard na; dat denken telt mee in `max_tokens` (500 bij het gesprek), dus bij moeilijkere vragen bleef er geen tekst over.
- Oplossing: `ccModelBody` op alle zeven aanvragen. MAIN zonder denken (`between_tools`), DEEP (Opus 5.5, denkt altijd) met lage effort en extra ruimte. Foto-uitlezen leest nu op bloktype.
- **Controle voor Jim**: stel dezelfde twee vragen opnieuw; ook een recept maken en een foto van een maaltijd.

## Batch 5 okt (8) — Brede test en testlijst — af (`lime-20261005-10`)
Jim: "Kan je alles testen wat we vanmorgen hebben gebouwd? En een testlijst maken die ik kan volgen? En checken of layout en vormgeving klopt?"
- Brede test (Playwright, nep-AI, 390 en 360 px): 54 van 54 controles goed, geen JavaScript-fouten. Vormgevingscontrole per scherm (horizontaal scrollen, afgekapte tekst, ongelijke rijen, centrering, tikgebied) op 23 schermen: netjes.
- Opgelost: *Meal prep* raakte op smalle schermen de knoprand (13 px onder 375 px), de datum in de Coach-kop brak af op 360 px, en *Schat voedingswaarden* plakte tegen de voedingsregel.
- Testlijst voor de iPhone: `docs/testlijst-20261005.md`.
- Opgemerkt, niet aangepast: vrije *liever niet*-woorden kun je alleen in de wizard kiezen (vier chips); de oude receptknoppen (*Inplannen/Gegeten/Bewaren*, *Andere ideeën*) hebben nog de oude vorm (hoekig in plaats van pil).

## Batch 5 okt (7) — Meal prep als knop — af (`lime-20261005-9`)
Jim: "Hoe zou meal prep mooi een knop kunnen worden zonder dat het druk wordt?" → optie 2 gekozen ("past meer in het concept"): *Weekend* wordt *Meal prep*.
- Rij Maaltijd: *Snel / Meal prep / Comfort*. Meal prep = één keer koken voor meerdere dagen, minstens 4 porties (of personen × 2), 3–4 dagen houdbaar, saus apart, laatste stap over bakjes en opwarmen. Label *Meal prep* in Mijn recepten. *Chef testen* heeft er een zesde vraag voor.
- Uitgebreid koken voor één avond kan via Sparren.
- **Controle voor Jim**: tik *Meal prep*. Klopt het aantal porties, blijft het echt een paar dagen goed, en staat de bewaartip in de laatste stap? Past "Meal prep" netjes in de knop op je iPhone?

## Batch 5 okt (6) — Receptinspiratie verwerkt — af (`lime-20261005-8`)
Jim stuurde het document *Receptinspiratie*. Keuzes: A (stijl aanvullen) ja, B (kcal als informatie) ja, C meal prep alleen in de stijl, samenvatting in de repository ja.
- `CHEF_STIJL` aangevuld (meal prep, cottage cheese/yoghurt-dips, echte eiwitsnack, eiwit per stuk, geen poeder of merken, geen kipgehakt, bronnen, ijkpuntlijst). Tijden korter (Snel 10–20 min).
- Kcal per portie als schatting bij elk nieuw recept.
- Samenvatting: `docs/receptinspiratie.md`.
- **Controle voor Jim**: maak een paar Snel-recepten en een snack. Kloppen tijd, kcal en eiwit ongeveer? Draai *Chef testen* en vergelijk.

## Batch 5 okt (5) — Bijstuurpillen bij Chef — af (`lime-20261005-5`)
Jim: "Moeten we de dialoogwijze bij Chef gelijktrekken naar Coach?" → advies: geen open chat, wel kiezen en bijsturen met tikken. "Ja, bouw de bijstuurpillen eerst."
- Onder elk voorstel: *Lichter*, *Sneller*, *Meer eiwit*, *Meer vezels*, *Vega*, *Anders…*. Eén tik = Chef past dat recept aan (één aanroep).
- **Controle voor Jim**: maak recepten, tik *Meer vezels* en *Vega*. Klopt de aanpassing, blijft de stijl van Chef, en kloppen de nieuwe eiwit- en vezelwaarden ongeveer?

## Batch 5 okt (4) — Naar Chef preciezer — af (`lime-20261005-4`)
Jim: "Elk gesprek? Ook als het over hamstring gaat?" → *Naar Chef* alleen bij hele eetwoorden (niet bij "lunchpauze" of "bereid je voor"); Chef gebruikt uit het gesprek alleen wat over eten, voeding of herstel gaat.

## Batch 5 okt (3) — Coach en Chef weten meer van elkaar — af (`lime-20261005-3`)
Jim: "weten chef en coach zo genoeg van elkaars kennis?" → advies akkoord ("ja, bouw maar").
- *Naar Chef* neemt het gesprek mee: label "Uit je gesprek met Coach" (✕ = niet meenemen), gaat mee met de volgende reeks recepten.
- Coach kent je keuken: voorraad en eiwit/vezels van bewaarde recepten bij eetvragen; meer eetwoorden herkend ("wat zal ik vanavond maken?").
- Chef kent je week: training van vandaag en vezelgemiddelde van de week, ook bij een gewone maaltijd.
- **Controle voor Jim**: vraag Coach iets over eten, tik *Naar Chef*, kies Snel. Sluit het recept aan bij wat Coach zei? Vraag Coach "wat zal ik vanavond maken?" met iets in je voorraad.

## Batch 5 okt (2) — Chef slimmer en Sparren fase 1 — af (`lime-20261005-2`)

Jim: "alles akkoord" op het advies: Sparren alleen Dinertje, sturen op eiwit en vezels (kcal bestaat niet in de app), eerst een kleine batch Chef-verbeteringen.

### S1. Chef slimmer — af
- Wat Coach over eten onthoudt, gaat nu mee naar Chef (niet in privacymodus).
- Chef krijgt de cijfers van vandaag mee: hoeveel eiwit en vezels er nog open staan.
- Afwisseling over dagen: de maaltijden van de afgelopen week en de laatst bewaarde recepten gaan mee.
- Harde controle: een recept met iets wat je liever niet eet (of vlees bij vega) komt niet meer in beeld.
- Model voor gesprek en recepten: Sonnet 5.5 (was Sonnet 4.6). **Controle voor Jim: draai Instellingen › Testen › Coach testen en Chef testen en vergelijk met de vorige uitslag.**

### S2. Sparren fase 1 — af (wacht op Jims test)
- Chef › regel *Sparren* › *Dinertje voor gasten*: voor wie (met "Eet iemand iets niet?"), wat voor avond, hoeveel tijd. Daarna een samenvatting. Terug kan op elk scherm. Niets wordt bewaard.
- Afwijking van de eerste schets: geen halve knop naast *Uit je voorraad*, maar een eigen regel *Sparren* onder *Voorraad*, omdat Chef al met regels werkt (Sport, Maaltijd, Voorraad).

### S3. Sparren fase 2 — af (`lime-20261005-6`, wacht op Jims test)
Drie richtingen als kaartjes (vertrouwd, draai, gok) in één aanroep: titel, waarom, tijd, eiwit, hoofdingrediënten, opzet; macro's klein onderaan. Laadstatus; bij fout of ongeldige JSON één keer automatisch opnieuw, daarna *Opnieuw*. Wensen van gasten hard gecontroleerd met `ccAvoidHit`.
- **Controle voor Jim**: kies bijvoorbeeld Vrienden + Noten + Vega. Verschillen de drie richtingen duidelijk? Zit er nergens vlees, vis of noten in? Klopt de tijd bij "Een uurtje"? Test ook zonder internet (melding + *Opnieuw*).

### S4. Sparren fase 3 — af (`lime-20261005-7`, wacht op Jims test)
Eén bijstuurronde (Lichter / Makkelijker / Vegetarisch / Goedkoper / Meer wow / Iets heel anders), dan *Maak het recept*: bestaand receptformaat, `validateChefRecipe`, bestaande opslag, extra velden `bron:'sparren'` en `stand:'dinertje'`, opzet als notitie. Max. 3 aanroepen per sessie (plus hooguit één automatische herhaling). Daarna Gist-sync testen.
- **Controle voor Jim**: van knop tot opgeslagen recept op iPhone Safari, voor beide richtingen *Lichter* en *Iets heel anders*. Staat het recept in Mijn recepten (Diner) en op een tweede apparaat na sync? Werkt een bestaand recept nog als voorheen? Zit een wens van gasten (bijv. noten) nergens in het recept?

---

## 0. Zo werk je (lees dit eerst)

1. **Lees `CLAUDE.md` helemaal.** Vooral §2 (zeven regels), §3 (tokens, zones, vaste patronen, AI) en §5 (versies). Wat daar staat, geldt hier ook.
2. **Eén taak tegelijk, in de volgorde hieronder.** Per taak: zoek de code met `grep -n`, lees de functie helemaal, verander zo weinig mogelijk, test, ga dan pas verder. Het bestand is groot (ongeveer 9.000 regels, veel code op één regel). Lees gericht met `sed -n 'a,bp'`, nooit het hele bestand.
3. **Bewerk met exacte vervangingen.** Gebruik een klein Python-script met `assert s.count(old)==1` vóór elke `replace`, en lees en schrijf in bytes. Het bestand heeft CRLF-regeleinden; laat die heel (`.replace('\n','\r\n')` bij nieuwe tekst).
4. **Verzin niets wat je niet hebt gecontroleerd.** Zeg alleen "werkt" als je het getest hebt. Wat je niet kunt testen (iPhone, echte API), noem je als controlepunt voor Jim.
5. **Stoppunten.** Wezenlijke aanpassingen eerst als plan met schets aan Jim (CLAUDE.md §2). Samenvoegen met `main` alleen na Jims "voeg samen".
6. **Niet aanraken** (tenzij de opdracht erom vraagt): spraak en geluid (`ccPrepareMic`, Web Audio), privacymodus, sync, `coachFrontSend` en `parseSmartInput`. Nooit een modelnaam hardcoden (gebruik `CC_MODEL_*`). Geen nieuwe externe afhankelijkheden. Alle tekst van gebruiker of AI die in `innerHTML` komt, gaat door `escapeText()`.

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

## Na elke batch
- CLAUDE.md bijwerken waar iets verandert (basisversie, `CHEF_STIJL`-regels, nieuwe functies of velden).
- Geen achterblijvende oude code (regel 7). Controleer dat functies die je vervangt nergens meer worden aangeroepen.
