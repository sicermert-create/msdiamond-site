/* Ms. Diamond Coiffure — service worker
   Sayfa ve içerik her zaman önce internetten alınır (panel değişiklikleri anında görünür);
   internet yoksa son kaydedilen sürüm gösterilir. Fotoğraflar önbellekten hızlı açılır. */
const VERSION = 'msd-v1';
const CORE = ['/', '/index.html', '/js/site.js', '/content/site.json', '/favicon.svg', '/kvkk.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith('/admin')) return;

  // Fotoğraflar: önce önbellek
  if (url.pathname.startsWith('/img/')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }

  // Sayfalar, kod, içerik: önce internet
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('/'))));
});
