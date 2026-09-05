// NutriX service worker — caches the app shell so the UI still loads offline.
// It intentionally does NOT cache API calls (Claude, Wikipedia images, your backend) —
// those need a live network connection, so they're left to pass through normally.

const CACHE_NAME = "nutrix-shell-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache calls to external APIs — always go to the network for these.
  const isApiCall =
    url.hostname.includes("anthropic.com") ||
    url.hostname.includes("wikipedia.org") ||
    url.hostname.includes("supabase.co");
  if (isApiCall) return;

  // App shell: cache-first, falling back to network.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
