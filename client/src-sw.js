// import necessary modules and strategies
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// precache assets
precacheAndRoute(self.__WB_MANIFEST);

// cache HTML pages with CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});


registerRoute(({ request }) => request.mode === 'navigate', pageCache);
// TODO: Implement asset caching
// cache assets with StaleWhileRevalidate 
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    (request.destination === 'image' && request.url.includes('/images/')),
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// handle fetch events
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);

  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error('Fetch error:', error);

      // offline response here
      const offlineResponse = new Response('<h1>Offline</h1>', {
        headers: { 'Content-Type': 'text/html' },
      });

      return offlineResponse;
    })
  );
});

// log additional information for debugging
console.log('Service Worker loaded:', self);

// event listener for fetch errors in the service worker
self.addEventListener('message', (event) => {
  if (event.data.error) {
    // error message for service worker fetch errors
    console.error('Fetch error:', event.data.error);
    document.body.innerHTML = '<h1>Offline</h1>';
  }
});

