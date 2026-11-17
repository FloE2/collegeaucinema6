// Permet de rouvrir l'application sans réseau (salle de cinéma).
// Stratégie : réseau d'abord, copie en cache en secours.
const CACHE = "echappees-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== location.origin && u.hostname !== "www.gstatic.com") return;
  e.respondWith(
    fetch(req)
      .then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
