// Alles rund um die Tasten-Notation aus den YAML-Dateien:
// welches Symbol eine Taste bekommt, wie sie heißt und in welcher Reihenfolge
// Modifier angezeigt werden. Wird beim Build (Schema) und im Browser (Suche) genutzt.

export interface TastenInfo {
  /** Was auf der Keycap steht, z. B. "⌘" oder "T" */
  symbol: string;
  /** Name für Tooltip und Screenreader, z. B. "Befehl" */
  name: string;
  /** Breitere Keycap, z. B. für die Leertaste */
  breit?: boolean;
}

/** Apple-Reihenfolge: fn ⌃ ⌥ ⇧ ⌘ */
export const MODIFIER = ['fn', 'ctrl', 'opt', 'shift', 'cmd'] as const;

const SONDERTASTEN: Record<string, TastenInfo> = {
  fn: { symbol: 'fn', name: 'Funktion (Globus)' },
  ctrl: { symbol: '⌃', name: 'Control' },
  opt: { symbol: '⌥', name: 'Wahl (Option)' },
  shift: { symbol: '⇧', name: 'Umschalt' },
  cmd: { symbol: '⌘', name: 'Befehl' },
  enter: { symbol: '↩', name: 'Zeilenschalter (Return)' },
  esc: { symbol: '⎋', name: 'Escape' },
  tab: { symbol: '⇥', name: 'Tabulator' },
  capslock: { symbol: '⇪', name: 'Feststelltaste' },
  space: { symbol: 'Leertaste', name: 'Leertaste', breit: true },
  delete: { symbol: '⌫', name: 'Rückschritt (Löschen)' },
  fwddelete: { symbol: '⌦', name: 'Entfernen (vorwärts löschen)' },
  left: { symbol: '←', name: 'Pfeil nach links' },
  right: { symbol: '→', name: 'Pfeil nach rechts' },
  up: { symbol: '↑', name: 'Pfeil nach oben' },
  down: { symbol: '↓', name: 'Pfeil nach unten' },
  home: { symbol: '↖', name: 'Pos1 (Anfang)' },
  end: { symbol: '↘', name: 'Ende' },
  pageup: { symbol: '⇞', name: 'Bild auf' },
  pagedown: { symbol: '⇟', name: 'Bild ab' },
};

const F_TASTE = /^F([1-9]|1[0-2])$/;

/** Prüft eine einzelne Taste. Gibt bei Fehlern eine verständliche Meldung zurück, sonst null. */
export function pruefeTaste(taste: string): string | null {
  if (taste in SONDERTASTEN || F_TASTE.test(taste)) return null;
  const lower = taste.toLowerCase();
  if (lower in SONDERTASTEN) {
    return `„${taste}“ bitte klein schreiben: „${lower}“.`;
  }
  if ([...taste].length !== 1) {
    return `Unbekannte Taste „${taste}“. Erlaubt sind einzelne Zeichen (z. B. T, ß, +), F1–F12 oder: ${Object.keys(SONDERTASTEN).join(', ')}.`;
  }
  if (taste !== taste.toUpperCase()) {
    return `Buchstaben bitte so schreiben, wie sie auf der Taste stehen: „${taste.toUpperCase()}“ statt „${taste}“.`;
  }
  return null;
}

export function tastenInfo(taste: string): TastenInfo {
  const sonder = SONDERTASTEN[taste];
  if (sonder) return sonder;
  if (F_TASTE.test(taste)) return { symbol: taste, name: `Funktionstaste ${taste}` };
  return { symbol: taste, name: `Taste ${taste}` };
}

/** Sortiert Modifier in Apple-Reihenfolge nach vorne, die übrigen Tasten bleiben in ihrer Reihenfolge. */
export function sortiereTasten(tasten: readonly string[]): string[] {
  const rang = (t: string) => {
    const i = (MODIFIER as readonly string[]).indexOf(t);
    return i === -1 ? MODIFIER.length : i;
  };
  return [...tasten].sort((a, b) => rang(a) - rang(b));
}

/** Eindeutiger Schlüssel einer Kombination, unabhängig von der Schreibreihenfolge (für Konflikt-Prüfung). */
export function kombiSchluessel(tasten: readonly string[]): string {
  return sortiereTasten(tasten).join('+');
}

/** Kombination als lesbarer Text, z. B. "⌃⌘F" – für Suche und Tooltips. */
export function kombiText(tasten: readonly string[]): string {
  return sortiereTasten(tasten)
    .map((t) => tastenInfo(t).symbol)
    .join('');
}
