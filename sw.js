/* Service worker – Náklady Obytňák Boxer. Zvyšte VERSION při každé změně souborů. */
var VERSION = 'obytnak-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './van.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-64.png'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // stale-while-revalidate: okamžitě z cache, na pozadí aktualizace
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (cached) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return cache.match('./index.html');
        return cached;
      });
      if (cached) { e.waitUntil(net.catch(function () {})); return cached; }
      return net;
    });
  }));
});
