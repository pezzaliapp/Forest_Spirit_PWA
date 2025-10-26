// Forest Spirit (Vanilla) — service worker (cache-first local assets)
const CACHE='forest-spirit-vanilla-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil((async()=>{ const c=await caches.open(CACHE); await c.addAll(ASSETS); self.skipWaiting(); })());
});
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))); self.clients.claim(); })());
});
self.addEventListener('fetch', e=>{
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const m=await c.match(e.request,{ignoreSearch:true});
    if(m) return m;
    try{
      const r=await fetch(e.request);
      if(new URL(e.request.url).origin===location.origin){ c.put(e.request,r.clone()); }
      return r;
    }catch(err){ return m || Response.error(); }
  })());
});
