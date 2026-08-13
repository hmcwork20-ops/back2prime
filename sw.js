/* BACK2PRIME · service worker — cache-first para funcionar sin cobertura en el gym */
const V = 'b2p-v3';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/basecoat.min.css',
  './assets/styles.css',
  './assets/data.js',
  './assets/app.js',
  './assets/views.js',
  './assets/fonts/BarlowCondensed-600.woff2',
  './assets/fonts/BarlowCondensed-700.woff2',
  './assets/fonts/Inter-400.woff2',
  './assets/fonts/Inter-600.woff2',
  './assets/fonts/Inter-700.woff2',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const DEV = ['localhost', '127.0.0.1'].includes(self.location.hostname);

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // en local: red primero (desarrollo sin sorpresas de caché)
  if (DEV) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request.mode === 'navigate' ? './index.html' : e.request)));
    return;
  }
  // navegación → index (app de una sola página)
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(r => r || fetch(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(e.request, copy)); }
        return res;
      });
    })
  );
});
