// Lädt alle Apps, prüft dateiübergreifende Regeln und bereitet die Daten für die Seiten auf.

import { getCollection, type CollectionEntry } from 'astro:content';
import { kombiSchluessel, kombiText } from './tasten';

type Daten = CollectionEntry<'apps'>['data'];
export type App = Daten['app'] & { anzahl: number };
export type Shortcut = Daten['shortcuts'][number];

export interface Kategorie {
  name: string;
  anker: string;
  shortcuts: Shortcut[];
}

export interface AppMitShortcuts {
  app: App;
  shortcuts: Shortcut[];
  kategorien: Kategorie[];
}

let cache: AppMitShortcuts[] | undefined;

export async function ladeApps(): Promise<AppMitShortcuts[]> {
  if (cache) return cache;

  const eintraege = await getCollection('apps');
  const alleIds = new Map<string, string>();

  const apps = eintraege.map(({ id: dateiname, data }) => {
    if (data.app.id !== dateiname) {
      throw new Error(
        `src/data/apps/${dateiname}.yaml: Die App-id „${data.app.id}“ muss dem Dateinamen entsprechen („${dateiname}“).`,
      );
    }

    for (const s of data.shortcuts) {
      const andere = alleIds.get(s.id);
      if (andere) throw new Error(`Doppelte Shortcut-id „${s.id}“ in ${andere} und ${dateiname}.`);
      alleIds.set(s.id, dateiname);
    }

    warneBeiKonflikten(data.app.name, data.shortcuts);

    return {
      app: { ...data.app, anzahl: data.shortcuts.length },
      shortcuts: data.shortcuts,
      kategorien: gruppiere(data.shortcuts),
    };
  });

  cache = apps.sort((a, b) => a.app.reihenfolge - b.app.reihenfolge || a.app.name.localeCompare(b.app.name, 'de'));
  return cache;
}

/** Gruppiert nach Kategorie (Reihenfolge wie in der Datei); wichtige Einträge stehen jeweils zuerst. */
function gruppiere(shortcuts: Shortcut[]): Kategorie[] {
  const gruppen = new Map<string, Shortcut[]>();
  for (const s of shortcuts) {
    gruppen.set(s.kategorie, [...(gruppen.get(s.kategorie) ?? []), s]);
  }
  return [...gruppen].map(([name, liste]) => ({
    name,
    anker: ankerVon(name),
    shortcuts: [...liste.filter((s) => s.wichtig), ...liste.filter((s) => !s.wichtig)],
  }));
}

function warneBeiKonflikten(appName: string, shortcuts: Shortcut[]) {
  const gesehen = new Map<string, string>();
  for (const s of shortcuts) {
    for (const kombi of [s.tasten, ...(s.alternativ ?? [])]) {
      const schluessel = kombiSchluessel(kombi);
      const vorher = gesehen.get(schluessel);
      if (vorher && vorher !== s.id) {
        console.warn(`⚠️  Konflikt in ${appName}: ${kombiText(kombi)} ist bei „${vorher}“ und „${s.id}“ eingetragen.`);
      }
      gesehen.set(schluessel, s.id);
    }
  }
}

export function ankerVon(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Link relativ zur Basis-Adresse der Seite (wichtig für GitHub Pages). */
export function pfad(teil = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${teil}`;
}
