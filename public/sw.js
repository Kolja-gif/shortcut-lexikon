// Offline-Speicher für die installierte App.
// Immer zuerst aus dem Netz laden (damit neue Shortcuts sofort erscheinen),
// nur ohne Internet die zuletzt gespeicherte Version anzeigen.

const CACHE = 'shortcut-lexikon';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((antwort) => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE).then((cache) => cache.put(request, kopie));
        }
        return antwort;
      })
      .catch(() => caches.match(request, { ignoreSearch: true })),
  );
});
