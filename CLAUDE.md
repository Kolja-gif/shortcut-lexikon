# Shortcut-Lexikon

Persönliches Nachschlagewerk für Mac-Tastenkürzel, sortiert nach App. Einziger Nutzer ist Kolja (MacBook, deutsche Tastatur, deutsche Menüs). Die vollständige Spezifikation steht in `SPEC.md`. Lies sie, bevor du größere Änderungen machst.

Kolja ist kein Entwickler. Erkläre Änderungen kurz und verständlich auf Deutsch, ohne unnötigen Fachjargon.

## Befehle

- `npm run dev` – startet die Seite lokal
- `npm run build` – baut die Seite und prüft dabei alle Daten (immer vor einem Commit ausführen)
- `npm run preview` – zeigt den fertigen Build lokal an

## Struktur

- `src/data/apps/*.yaml` – **die Inhalte**, eine Datei pro App. Hier passiert fast jede Änderung.
- `src/content.config.ts` – das Schema, das die YAML-Dateien prüft
- `src/components/` – UI-Bausteine (Keycap, ShortcutZeile, Suche, Seitenleiste …)
- `src/pages/` – Startseite und App-Seiten
- `src/styles/` – globales CSS mit Variablen für Farben, Abstände und Dunkelmodus

## Einen Shortcut hinzufügen

1. Öffne die passende Datei in `src/data/apps/`.
2. Prüfe, ob der Shortcut oder die Tastenkombination in dieser App schon existiert. Bei einem Konflikt sag es Kolja, statt doppelt einzutragen.
3. Ergänze den Eintrag nach dem Schema in `SPEC.md`. Er gehört in die passende Kategorie und braucht eine eindeutige `id` im Format `<app>-<kurzbeschreibung>`.
4. Setze `geprueft` nur dann auf das heutige Datum, wenn der Shortcut sicher ist. Sonst `null` setzen und Kolja bitten, ihn in der App zu testen.
5. Führe `npm run build` aus.
6. Committe mit einer kurzen deutschen Nachricht, z. B. `Chrome: Geschlossenen Tab wiederherstellen ergänzt`, und pushe.

## Eine neue App hinzufügen

Lege eine neue YAML-Datei mit `app`-Block an: `id`, `name`, Lucide-`icon`, Akzentfarbe, `reihenfolge`. Fülle sie mit den wichtigsten 20–30 Shortcuts. Andere Dateien sollten dafür nicht angepasst werden müssen. Wenn doch, ist das ein Hinweis, dass die Struktur verbessert werden sollte.

## Regeln für Inhalte

- **Nichts erfinden.** Im Zweifel `geprueft: null` setzen und nachfragen.
- Tasten so schreiben, wie sie auf der **deutschen Mac-Tastatur** beschriftet sind.
- Modifier werden in der Anzeige immer in der Reihenfolge ⌃ ⌥ ⇧ ⌘ sortiert. Das übernimmt der Code, nicht die Datendatei.
- Aktionen kurz und auf Deutsch mit dem Verb am Ende: „Neuen Tab öffnen“.
- Nur Tastenkürzel aufnehmen, keine Gesten, Textersetzungen oder Terminal-Befehle.
- Die Shortcuts der Claude-Desktop-App ändern sich häufig. Prüfe sie besonders sorgfältig.

## Regeln für Code und Design

- Übersichtlichkeit geht vor neuen Funktionen. Jede neue Funktion muss die Seite einfacher nutzbar machen, nicht voller.
- Keine neuen Abhängigkeiten ohne kurze Begründung gegenüber Kolja.
- Keine offiziellen Markenlogos, stattdessen Lucide-Icons.
- Alle Farben kommen aus CSS-Variablen. Hell- und Dunkelmodus müssen beide stimmig aussehen.
- Die Oberfläche ist komplett auf Deutsch.
- Halte dich an die Phasen in `SPEC.md`. Funktionen aus späteren Phasen werden erst gebaut, wenn Kolja das möchte.
