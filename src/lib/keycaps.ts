// Erzeugt das HTML für Tastenkombinationen. Wird von der Seite (Kombi.astro)
// und von der Suche im Browser genutzt, damit beide exakt gleich aussehen.

import { sortiereTasten, tastenInfo } from './tasten';

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[z]!);

function tasteHtml(taste: string): string {
  const { symbol, name, breit } = tastenInfo(taste);
  const klassen = ['taste', breit && 'taste--breit', symbol.length > 1 && !breit && 'taste--text']
    .filter(Boolean)
    .join(' ');
  return `<kbd class="${klassen}" data-tip="${escape(name)}" aria-label="${escape(name)}">${escape(symbol)}</kbd>`;
}

function einzelKombi(tasten: readonly string[]): string {
  return `<span class="kombi">${sortiereTasten(tasten).map(tasteHtml).join('')}</span>`;
}

export function kombiHtml(tasten: readonly string[], alternativ: readonly (readonly string[])[] = []): string {
  return [tasten, ...alternativ].map(einzelKombi).join('<span class="oder">oder</span>');
}
