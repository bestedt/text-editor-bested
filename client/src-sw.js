const { offlineFallback, warmStrategyCache } = require('workbox-recipes');

// added the stale while revalidate strategy for the page cache and the assets cache
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

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

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // adding the condition to check that the request is for an image, style or script
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  // using the stale while revalidate strategy, which will return the cached response if there is one, otherwise it will fetch the asset from the network
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
    // using the cacheable response plugin to cache the successful responses
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // setting the cache expiration to 30 days
        maxAgeSeconds: 30 * 24 * 60 * 60, 
      }),
    ],
  })
);

// calling the offline fallback method to cache the offline page
offlineFallback();

