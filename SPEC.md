# Shortcut-Lexikon – Projektspezifikation

## Worum es geht

Ein persönliches Nachschlagewerk für Mac-Tastenkürzel, sortiert nach App. Es gibt genau einen Nutzer (Kolja). Er nutzt ein MacBook mit deutscher Tastatur und deutschen Menüs. Der Hauptzweck ist **schnelles Nachschlagen**. Lernfunktionen kommen später dazu. Die Seite muss **sehr übersichtlich und ansprechend** aussehen. Gepflegt wird sie ausschließlich über Claude Code.

## Ziele

1. Jeden gesuchten Shortcut in unter 5 Sekunden finden, entweder über die Suche oder über die App-Seite.
2. Neue Shortcuts lassen sich mit einem Satz an Claude Code hinzufügen und sind nach dem Push automatisch online.
3. Die Seite wirkt ruhig, aufgeräumt und macOS-ähnlich, nicht wie eine Entwickler-Dokumentation.
4. Die Inhalte sind verlässlich. Unsichere Shortcuts sind als solche erkennbar.

## Bewusst nicht enthalten

- **Trackpad-Gesten, Textersetzungen, Terminal-Befehle.** Es geht nur um Tastenkürzel.
- **Mehrere Nutzer, Login, Backend.** Die Seite ist ein persönliches Werkzeug.
- **Synchronisierung zwischen Geräten.** Fortschritt und Favoriten werden nur lokal im Browser (localStorage) gespeichert.
- **Bearbeiten über die Website.** Inhalte werden nur über Claude Code geändert.
- **Vollständige Shortcut-Listen.** Pro App kommen die wichtigsten 20–30 Shortcuts rein. Fehlende werden bei Bedarf ergänzt.
- **Offizielle Markenlogos.** Für die Apps werden neutrale Symbole verwendet (z. B. Lucide-Icons).

## Apps zum Start

| Reihenfolge | App | Hinweis |
|---|---|---|
| 1 | macOS allgemein | System, Finder-Grundlagen, Screenshots, Spotlight, Fenster, Textbearbeitung |
| 2 | Google Chrome | |
| 3 | Claude (Desktop-App) | Ändert sich oft. Shortcuts besonders sorgfältig prüfen |
| 4 | Vorschau | |
| 5 | Mail (Apple Mail) | |
| 6 | Microsoft Word (Mac) | Deutsche Menüs |

## Datenmodell

Pro App gibt es eine YAML-Datei unter `src/data/apps/<id>.yaml`. YAML ist gewählt, weil es für Menschen gut lesbar ist.

```yaml
app:
  id: chrome
  name: Google Chrome
  icon: globe            # Lucide-Icon-Name
  farbe: "#4285F4"       # Akzentfarbe der App
  reihenfolge: 2

shortcuts:
  - id: chrome-neuer-tab
    aktion: Neuen Tab öffnen
    tasten: [cmd, T]
    kategorie: Tabs
    wichtig: true          # gehört zu den Top-Shortcuts, wird hervorgehoben
    tags: [tab, neu]       # zusätzliche Suchbegriffe
    notiz: ""              # optional
    geprueft: 2026-10-01   # null = noch nicht in der echten App geprüft
```

**Tasten-Notation**

- Modifier: `ctrl`, `opt`, `shift`, `cmd`, `fn`. Sie werden immer in der Apple-Reihenfolge ⌃ ⌥ ⇧ ⌘ angezeigt, unabhängig davon, wie sie in der Datei stehen.
- Zeichentasten schreiben, wie sie auf der **deutschen** Tastatur beschriftet sind (z. B. `ß`, `+`, `#`, `Ü`).
- Sondertasten: `enter`, `esc`, `tab`, `space`, `delete`, `fwddelete`, `left`, `right`, `up`, `down`, `home`, `end`, `pageup`, `pagedown`, `F1`–`F12`.
- Optional `alternativ: [[...]]` für zweite Kombinationen, die dasselbe tun.

**Validierung**

- Ein Schema (Zod) prüft jede Datei beim Build. Ein fehlerhafter Eintrag lässt den Build fehlschlagen und zeigt eine verständliche Fehlermeldung.
- Doppelte `id` führen zu einem Fehler.
- Gleiche Tastenkombination zweimal in derselben App führt zu einer Warnung (Konflikt).

## Funktionen

### Phase 1 – Nachschlagen (MVP)

- **Startseite**: Alle Apps als Kacheln mit Symbol, Name und Anzahl der Shortcuts. Darunter eventuell die als `wichtig` markierten Shortcuts aller Apps.
- **App-Seite**: Die Shortcuts sind nach Kategorie gruppiert. Oben stehen Sprunglinks zu den Kategorien. `wichtig`-Einträge stehen innerhalb jeder Kategorie zuerst und sind dezent hervorgehoben.
- **Globale Suche**: Sie öffnet sich mit ⌘K oder `/`, ist ein Overlay im Stil von Spotlight und lässt sich komplett per Tastatur bedienen (Pfeiltasten, Enter, Esc). Sie durchsucht Aktion, Tags, Kategorie und App-Name, ist fehlertolerant (Fuse.js) und ignoriert Umlaute (also „offnen“ findet „öffnen“). Jedes Ergebnis zeigt ein App-Label.
- **Tastendarstellung**: Jede Taste ist eine eigene Keycap mit Symbol (⌘ ⌥ ⇧ ⌃ ↩ ⎋ ⇥ ⌫ ← → ↑ ↓). Beim Überfahren erscheint ein Tooltip mit dem Namen der Taste („Befehl“, „Wahl“, „Umschalt“, „Control“).
- **Ungeprüfte Einträge** (`geprueft: null`) bekommen ein dezentes Symbol mit Tooltip „Noch nicht geprüft“.
- **Hell- und Dunkelmodus** folgen automatisch der Systemeinstellung.

### Phase 2 – Merken

- Favoriten (⭐) und „Kann ich“ (✓) pro Shortcut, gespeichert in localStorage.
- Ein Fortschrittsbalken pro App („12 von 25 gelernt“).
- Ein Filter „Nur Favoriten“ und „Nur noch nicht gelernte“.
- **Rückwärtssuche**: Eine Kombination eingeben und sehen, was sie in jeder App tut.
- „Shortcut des Tages“ auf der Startseite. Er wird bevorzugt aus den noch nicht gelernten Shortcuts gewählt.

### Phase 3 – Lernen

- **Karteikarten-Modus** pro App oder für alle Apps. Die Aktion wird angezeigt, mit Leertaste wird die Antwort aufgedeckt, dann bewertet Kolja mit „Wusste ich“ oder „Wusste ich nicht“. Das Ergebnis aktualisiert „Kann ich“.
  - Hinweis: Shortcuts werden bewusst **nicht** per echtem Tastendruck abgefragt, weil Chrome viele ⌘-Kombinationen (⌘W, ⌘Q, ⌘T …) selbst abfängt.
- **Druckansicht** pro App als kompakter Spickzettel auf einer A4-Seite.

## Design

Das Leitbild ist eine ruhige, aufgeräumte Oberfläche, die sich wie eine native Mac-App anfühlt.

- **Schrift**: die Systemschrift (`-apple-system`, SF Pro). Keycaps bekommen etwas größere, gut lesbare Zeichen.
- **Layout**: Links eine schmale Seitenleiste mit den Apps (Symbol, Name, Anzahl). Oben die Suchleiste mit dem Hinweis „⌘K“. Rechts der Inhalt mit begrenzter Breite (ca. 900 px), damit Zeilen gut lesbar bleiben.
- **Shortcut-Zeilen**: Links steht die Aktion, rechts die Tasten, rechtsbündig ausgerichtet. So lässt sich die Spalte schnell überfliegen. Zwischen den Zeilen sind feine Trennlinien statt schwerer Karten.
- **Keycaps**: Helle Tasten mit leichter Unterkante (dezenter 3D-Effekt) und abgerundeten Ecken. Im Dunkelmodus entsprechend angepasst.
- **Farbe**: Neutraler Grundton. Die Akzentfarbe der jeweiligen App erscheint nur sparsam, etwa bei der aktiven Seitenleiste, der Kategorie-Überschrift und dem Symbol.
- **Viel Weißraum** und keine überflüssigen Elemente. Im Zweifel gilt: weglassen.
- **Feine Übergänge** (z. B. beim Öffnen der Suche), aber keine verspielten Animationen.

## Technik

- **Astro** als statischer Seitengenerator. Die YAML-Dateien sind Content Collections mit Zod-Schema.
- **Fuse.js** für die Suche.
- **Lucide** für die Symbole.
- **Eigenes CSS** mit CSS-Variablen für Farben und Abstände, ohne CSS-Framework.
- **Keine weiteren Abhängigkeiten** ohne guten Grund.
- **Hosting**: GitHub Pages, deployt automatisch per GitHub Actions bei jedem Push auf `main`. Hinweis: Bei einem kostenlosen GitHub-Account muss das Repository für Pages öffentlich sein. Die Inhalte sind unkritisch, die URL ist aber prinzipiell auffindbar.
- **Lokal**: `npm run dev` startet die Seite unter `localhost`.

## Pflege-Workflow

1. Kolja sagt Claude Code zum Beispiel: „Füge in Chrome den Shortcut zum Wiederherstellen geschlossener Tabs hinzu.“
2. Claude Code trägt den Shortcut in die passende YAML-Datei ein und prüft dabei, ob es Duplikate oder Konflikte gibt.
3. Claude Code führt `npm run build` aus, um zu prüfen, dass alles funktioniert.
4. Claude Code macht einen Commit mit einer verständlichen Nachricht und pusht. Die Seite ist danach automatisch aktualisiert.

## Inhaltsqualität

- Nur Shortcuts aufnehmen, die in der aktuellen Version der App existieren. Am verlässlichsten sind die Angaben aus den Menüs der App.
- Aktionen werden kurz und auf Deutsch formuliert, mit dem Verb am Ende: „Neuen Tab öffnen“, „Seite drucken“.
- Kategorien folgen den deutschen Menünamen der App, wo das sinnvoll ist.
- Bei Unsicherheit wird **nichts erfunden**. Der Eintrag bekommt `geprueft: null`, und Claude Code bittet Kolja, ihn in der App zu prüfen.

## Abnahmekriterien Phase 1

- [ ] Alle 6 Apps sind vorhanden, jede mit 20–30 Shortcuts.
- [ ] Eine Suche nach „screenshot“ findet ⌘⇧3, ⌘⇧4 und ⌘⇧5.
- [ ] Eine Suche nach „offnen“ (ohne Umlaut) findet Einträge mit „öffnen“.
- [ ] ⌘K und `/` öffnen die Suche, Esc schließt sie, Pfeiltasten und Enter funktionieren.
- [ ] Modifier werden immer in der Reihenfolge ⌃ ⌥ ⇧ ⌘ angezeigt.
- [ ] Ein absichtlich fehlerhafter Eintrag lässt den Build mit verständlicher Meldung fehlschlagen.
- [ ] Hell- und Dunkelmodus sehen beide stimmig aus.
- [ ] Die Seite ist über GitHub Pages erreichbar und aktualisiert sich nach einem Push.
