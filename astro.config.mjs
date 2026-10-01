// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Die Seite liegt unter https://kolja-gif.github.io/shortcut-lexikon/
  site: 'https://kolja-gif.github.io',
  base: '/shortcut-lexikon',
  trailingSlash: 'ignore',
  // Alle sichtbaren Links im Hintergrund vorladen, damit der Wechsel sofort geht
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  devToolbar: { enabled: false },
});
