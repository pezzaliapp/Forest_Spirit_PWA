// Legacy ES5 SW (optional). Safe to ignore if opened via file://
var CACHE='forest-spirit-legacy-v1';
var ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(m){ return m || fetch(e.request).then(function(r){ if(new URL(e.request.url).origin===location.origin){ var cp=r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request,cp); }); } return r; }).catch(function(){ return m || Response.error(); }); }));
});
