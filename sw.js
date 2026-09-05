/* BACK2PRIME · service worker — cache-first para funcionar sin cobertura en el gym */
const V = 'b2p-v94';
const CORE = [
  './',
  './index.html',
  './privacidad.html',
  './clave.html',
  './confirmado.html',
  './manifest.webmanifest',
  './assets/styles.css',
  './assets/data.js',
  // Los otros cuatro idiomas NO se precargan: eran 366 KB que una instalación
  // no lee jamás (se usa uno). Se descargan al elegirlos en Ajustes y el
  // manejador de abajo los guarda en caché, así que a partir de ese momento
  // ese idioma también funciona sin cobertura.
  './assets/gen.js',
  './assets/mapa.js',
  './assets/fotos.js',
  './assets/productos.js',
  './assets/supl.js',   // solo el manifiesto: las fotos entran al verlas
  './assets/pictos.js',
  './assets/deportes.js',
  './assets/iconos.js',
  './assets/vendor/supabase.js',
  './assets/nube-config.js',
  './assets/nube.js',
  './assets/nativo.js',   // inerte en la web; en la app de tienda hace de puente
  './assets/app.js',
  './assets/views.js',
  './assets/onb.js',
  './assets/fonts/BarlowCondensed-600.woff2',
  './assets/fonts/BarlowCondensed-700.woff2',
  './assets/fonts/PublicSans-400.woff2',
  './assets/fonts/PublicSans-600.woff2',
  './assets/fonts/PublicSans-700.woff2',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/maskable-512.png'
];

/* Precarga saltándose la caché HTTP del navegador.
   cache.addAll() parece lo obvio, pero lee de la caché HTTP: GitHub Pages sirve
   los assets con max-age, así que el service worker nuevo se guardaba las copias
   CADUCADAS y subir la versión no arreglaba nada — volvía a traerse lo viejo.
   Pasó de verdad en la v20: la red tenía el CSS nuevo y la caché el anterior.
   Con cache:'reload' cada recurso se pide a la red y de paso se refresca la
   caché HTTP. Si alguno falla, la instalación falla entera y se conserva la
   versión anterior, que es lo que queremos: mejor vieja y coherente que a
   medias. */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V)
      .then(c => Promise.all(CORE.map(u =>
        fetch(u, { cache: 'reload' }).then(r => {
          if (!r.ok) throw new Error('precarga ' + u + ' → ' + r.status);
          return c.put(u, r);
        })
      )))
      .then(() => self.skipWaiting())
  );
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
  // navegación → index (app de una sola página), PERO no secuestrar otras
  // páginas reales del sitio: /type.html se serviría como la app entera.
  if (e.request.mode === 'navigate') {
    const esOtraPagina = /\/[^/]+\.html$/.test(url.pathname) && !url.pathname.endsWith('/index.html');
    if (esOtraPagina) { e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); return; }
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
