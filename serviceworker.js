const CACHE_NAME = "marvel-chat-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./serviceworker.js",

  // Keep your two logos
  "./icons/icon-192.png",
  "./icons/icon-512.png", 
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          event.request.method === "GET"
        ) {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
