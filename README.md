# Spotřeba nafty

> **Ukázková aplikace.** Tato appka byla naprogramovaná pomocí [Claude Code](https://www.anthropic.com/claude-code)
> v rámci školení VibeCodingu — kurz **„Vibecoding: tvořte rychlostí myšlenky"**.
> Školitel: [**David Grudl**](https://davidgrudl.com/) (@dg), web: <https://www.umeligence.cz/kurzy>.

Jednoduchá appka do mobilu na zapisování tankování auta: **datum, množství nafty (litry)
a stav tachometru (km)**. Data se ukládají jen ve tvém telefonu (v prohlížeči), appka
funguje i bez internetu.

Žádný server ani databáze – jsou to jen statické soubory, které stačí položit na web
(GitHub Pages) a otevřít v telefonu.

## Soubory

Publikovaná appka je ve složce **`docs/`** (GitHub Pages servíruje jen ji). Soubory v kořeni
(`README.md`, `CLAUDE.md`) jsou jen pro repozitář a na web se nedostanou.

| Soubor (v `docs/`) | K čemu je |
|--------|-----------|
| `index.html` | Celá appka (formulář, seznam, záloha). |
| `manifest.webmanifest` | Aby šla appka přidat na plochu jako ikona. |
| `sw.js` | Aby appka fungovala i offline. |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ikona na ploše. |

## Jak appku dostat do telefonu (GitHub Pages)

1. Na [github.com](https://github.com) si vytvoř nový **veřejný repozitář**, např. `spotreba`
   (tlačítko **New** → název → **Create repository**).
2. Nahraj do něj **všechny soubory z této složky**:
   - Na stránce repozitáře klikni **Add file → Upload files**, přetáhni sem všechny soubory
     a dej **Commit changes**.
3. Zapni Pages: v repozitáři **Settings → Pages → Source: „Deploy from a branch"**,
   vyber větev **`main`** a složku **`/docs`**, dej **Save**.
4. Po chvilce (1–2 minuty) bude appka dostupná na adrese:
   `https://TVOJE-JMENO.github.io/spotreba/`
5. Tuhle adresu otevři **v telefonu v Safari** → tlačítko **Sdílet** → **Přidat na plochu**.
   Tím dostaneš ikonu a appka se chová jako samostatná aplikace (a funguje i offline).

## Záloha dat (doporučeno)

Data jsou jen v telefonu. Kdyby sis vymazal prohlížeč nebo přišel o mobil, přišel bys o ně.
Proto v appce:

- **Exportovat** – stáhne soubor `.csv` se všemi záznamy. Ulož si ho do iCloudu nebo pošli
  e-mailem sobě. Soubor jde otevřít i v Excelu.
- **Načíst zálohu** – z dříve staženého souboru data zase obnovíš (i na novém telefonu).

Udělej si export hned po prvních pár zápisech, ať máš jistotu, že záloha funguje.

## Vyzkoušení na počítači

Service worker (offline režim) potřebuje běžet přes `http`, ne přímo ze souboru. Spusť
jednoduchý server nad složkou `docs/` a otevři adresu v prohlížeči:

```bash
php -S localhost:8000 -t docs
# pak otevři http://localhost:8000/
```
