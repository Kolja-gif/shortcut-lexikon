/** Wandelt einen Lucide-Namen wie "app-window" in den Schlüssel "AppWindow" um. */
export function iconSchluessel(name: string): string {
  return name
    .split('-')
    .map((teil) => teil.charAt(0).toUpperCase() + teil.slice(1))
    .join('');
}
