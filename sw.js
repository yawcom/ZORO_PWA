const CACHE_NAME = 'zoro-sequence-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/manifest.json',
  '/assets/images/bg.jpg',
  '/assets/images/bgStart.jpg',
  '/assets/images/bgGameOver.jpg',
  '/assets/images/bgWin.jpg',
  '/assets/images/Copy.png'
];

// Cache card images
for (let i = 1; i <= 32; i++) {
  urlsToCache.push(`/assets/images/${i}.png`);
}

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

