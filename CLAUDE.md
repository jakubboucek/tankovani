# CLAUDE.md — Spotřeba nafty

> Tento soubor udržuj aktuální. Kdykoli změníš chování appky, podobu dat, pravidla UX,
> strategii service workeru nebo nasazení, uprav i příslušnou sekci zde ve stejné změně.
> Zaznamenávej jen věci specifické pro TUTO appku — ne obecné konvence.

> **Pracovní postup:** verzuj po každé ucelené úspěšné změně — jakmile je změna hotová a
> ověřená, udělej `git commit` i `git push` do `main` (Pages se přebuildí samy). Slučuj do
> jednoho commitu jen těsně související úpravy; nenech hotovou práci necommitnutou.

## Co to je

**Čistě klientská offline PWA** pro zápis tankování auta. Žádný server, žádná databáze,
žádný build, žádný framework, žádné závislosti — jen statické soubory otevřené v prohlížeči.
Majitel je **nevývojář** a chce jednoduché řešení s minimální údržbou.

Rozvržení repozitáře:
- **`docs/`** — publikovaná appka (GitHub Pages servíruje **jen tuhle složku**):
  - `index.html` — celá appka (HTML + CSS + JS v jednom souboru).
  - `manifest.webmanifest`, `sw.js`, `icon-*.png`, `apple-touch-icon.png` — PWA obal.
- **kořen** — jen repo-dokumentace, která se NEpublikuje na web:
  - `README.md` — česky, pro koncového uživatele (jak nasadit a používat). Drž ho netechnický.
  - `CLAUDE.md` — tento soubor.

> Proč `docs/`: Pages je nastavené na `main /docs`, takže se na web dostane jen appka a
> `README.md`/`CLAUDE.md` v kořeni zůstanou mimo web. Nové **publikované** soubory dávej do
> `docs/`; repo-dokumentaci do kořene.

## Požadavky / rozhodnutí o produktu

- Tři pole, v tomto pořadí: **litry → km (tachometr) → datum**.
  Datum je poslední, předvyplněné na **dnešek**, ale přepisovatelné (zpětné dopisování z účtenek).
- **Bez pole na cenu** (záměrně odloženo; možná se doplní později).
- Po načtení musí být kurzor v poli **litry**.
- **Spotřeba l/100 km** se zobrazuje mezi po sobě jdoucími tankováními (počítá se podle
  rostoucích km); je to bonus, ne hlavní cíl — nesmyslné řádky se přeskočí.
- Texty UI jsou **česky**, hlídej české skloňování (např. množné číslo: 1 záznam /
  2–4 záznamy / 5+ záznamů, viz `zaznamu()` v `index.html`).

## Záludnosti, které nesmí zregresovat

- **Desetinná čárka:** pole na litry je `type="text"` + `inputmode="decimal"` + `pattern`,
  NE `type="number"`. `type="number"` tiše ZAHODÍ českou desetinnou čárku ("45,30" → ""),
  čímž se ztratí záznam. Hodnoty vždy parsuj přes `parseNumber()` (`replace(",", ".")`).
- **Žádné plovoucí UI.** Majitel výslovně nemá rád překryvy, které se objevují/mizí nad
  obsahem (toasty, nativní validační bubliny). Veškerá zpětná vazba musí být **inline ve
  stránce** a zůstat, dokud se problém nevyřeší:
  - Validace formuláře používá **Constraint Validation API** (`setCustomValidity()` pro
    české hlášky) a CSS `:user-invalid` (+ fallback `form.submitted input:invalid`), které
    řídí červený rámeček a inline `<p class="field-error">`. NEvolej `reportValidity()` a
    NEZaváděj zpět vyskakovací hlášky typu toast.
  - Akce zálohy hlásí výsledek inline řádkem `#backup-status` v kartě zálohy.

## Data a soukromí

- Uloženo v `localStorage` pod klíčem `fuelEntries.v1` jako pole
  `{ id, date: 'YYYY-MM-DD', liters: Number, km: Number, updatedAt: ISO }`.
- **Data nikdy neopouští zařízení** — nic se nikam neodesílá. Adresa na GitHub Pages je
  veřejná, ale servíruje jen appku; uživatelská data zůstávají v telefonu. Tak to udrž.
- `id` + `updatedAt` existují proto, aby šla **budoucí synchronizace** bezpečně slučovat —
  zachovej je.
- **Záložní CSV:** oddělené středníkem, UTF-8 s BOM, sloupce `id;datum;litry;km;upraveno`.
  Import je **upsert podle `id`** a ponechá novější `updatedAt` (opakovaný import je idempotentní).

## Service worker / aktualizace

- `sw.js`: **network-first pro stránku** (aby aktualizace appky dorazily k uživatelům
  automaticky, když jsou online), **cache-first pro statické soubory**. Díky tomu se změny
  kódu v `index.html` projeví při dalším online otevření bez nutnosti měnit verzi.
- Když změníš statické soubory (ikony/manifest), **zvedni `CACHE_VERSION`** v `sw.js`.
- Service worker potřebuje http, ne `file://`. Lokálně testuj přes `php -S localhost:8000 -t docs`
  (servíruj složku `docs/`; PHP 8.4 je k dispozici). Při testování změn může SW servírovat
  starou cache — odregistruj ho / vyčisti cache.

## Nasazení

- GitHub Pages z repozitáře **`jakubboucek/tankovani`**, větev `main`, složka **`/docs`**
  (publikuje se jen appka; `README.md`/`CLAUDE.md` v kořeni zůstávají mimo web).
  Živá URL: **https://jakubboucek.github.io/tankovani/**
- Nasazení = `git push origin main`; Pages se přebuildí cca za 1 min. Pak ověř živou URL.
- (Starší repozitář `jakubboucek/Spotreba` z roku 2020 je jiný, nesouvisející projekt.)

## Plánované / zatím nepostavené

- **Automatická záloha/synchronizace do cloudu**, aby data přežila ztrátu telefonu (možnosti:
  Google Sheet přes Apps Script, Firebase/Supabase, nebo soukromý GitHub repozitář). Datový
  model je na to už připravený.
- **Přehledy** spotřeby, až se nasbírá dost dat.
