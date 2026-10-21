const CACHE_NAME='papertrail-offline-v9';
const APP_FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('papertrail-offline-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;if(req.mode==='navigate'){event.respondWith(fetch(req).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));}return resp;}).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));});
