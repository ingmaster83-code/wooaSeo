const CACHE_NAME = 'wooaseo-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (new URL(event.request.url).origin !== self.location.origin) return; // 타사(광고·분석 등) 요청은 그대로 통과
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
