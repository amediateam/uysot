const CACHE_NAME = 'offline';
const IMAGES = 'images';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('Fetch failed; returning offline page instead.', error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // cache’dan qaytar
        }

        // Agar cache’da bo‘lmasa, fetch qilamiz va saqlaymiz
        return fetch(request).then(networkResponse => {
          return caches.open(IMAGES).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
