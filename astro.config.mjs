// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Die Seite liegt unter https://kolja-gif.github.io/shortcut-lexikon/
  site: 'https://kolja-gif.github.io',
  base: '/shortcut-lexikon',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
});
