/*
 * Service worker: makes the app work offline.
 *
 * Strategy:
 *  - The page itself (navigations / index.html) is NETWORK-FIRST, so when the
 *    phone is online it always gets the latest version of the app, and falls
 *    back to the cached copy only when offline. This means future updates show
 *    up automatically without users having to clear anything.
 *  - Static assets (manifest, icons) are CACHE-FIRST for speed/offline. If you
 *    change those files, bump CACHE_VERSION below so phones refetch them.
 */
const CACHE_VERSION = "spotreba-v1";
const APP_SHELL = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png"
];

// Pre-cache the app shell on install.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Remove old caches on activate.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for the page; cache-first for everything else (same-origin GET).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin pass through

  const isPage =
    req.mode === "navigate" ||
    url.pathname === "/" ||
    url.pathname.endsWith("/index.html");

  if (isPage) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = (await cache.match(req)) || (await cache.match("index.html"));
    return cached || Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}
