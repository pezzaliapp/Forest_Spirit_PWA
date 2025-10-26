// Forest Spirit — service worker (cache-first)
const CACHE = 'forest-spirit-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.1/pixi.min.js'
];

self.addEventListener('install', (e)=>{
  e.waitUntil((async()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map(u => new Request(u, {mode:'no-cors'})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e)=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  e.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const res = await fetch(req);
      if(req.url.startsWith(self.registration.scope) || req.url.includes('cdnjs.cloudflare.com')){
        cache.put(req, res.clone());
      }
      return res;
    }catch(err){
      return cached || Response.error();
    }
  })());
});
