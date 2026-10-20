/* Service worker – Náklady Obytňák Boxer. Při každé změně souborů zvyšte VERSION. */
var VERSION = 'obytnak-v2.0';
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
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function timeout(ms) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); }); }
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // stránka: nejdřív síť (max 3 s), jinak z cache → aktualizace se projeví hned, offline funguje
    e.respondWith(caches.open(VERSION).then(function (cache) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) cache.put('./index.html', res.clone());
        return res;
      });
      return Promise.race([net, timeout(3000)]).catch(function () {
        return cache.match('./index.html').then(function (c) { return c || net; });
      });
    }));
    return;
  }
  // ostatní soubory: hned z cache, na pozadí aktualizace
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (cached) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
      }).catch(function () { return cached; });
      if (cached) { e.waitUntil(net.catch(function () {})); return cached; }
      return net;
    });
  }));
});
