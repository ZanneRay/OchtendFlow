const CACHE = 'ochtendflow/shell-v2';
const SHELL = ['./','./index.html','./style.css','./app.mjs','./planner.mjs','./manifest.webmanifest','./assets/morning.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png'];
self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ochtendflow/shell-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
  const req = event.request, url=new URL(req.url);
  if (req.method!=='GET' || url.origin!==self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  const isShell = SHELL.some(path=>new URL(path,self.registration.scope).href===url.href);
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(()=>caches.open(CACHE).then(cache=>cache.match('./index.html'))));
  } else if (isShell) {
    event.respondWith(caches.open(CACHE).then(cache=>cache.match(req)).then(hit=>hit||fetch(req)));
  }
});
