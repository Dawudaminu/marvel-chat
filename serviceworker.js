const CACHE_NAME = "marvel-chat-v10001";

const APP_SHELL = [
  "./",
  "./index.html",
  "./firebaseconfig.js",
  "./manifest.json",
  "./serviceworker.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(names =>
        Promise.all(
          names.map(name => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
            return Promise.resolve();
          })
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isFirebaseRequest(url) {
  return (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("gstatic.com")
  );
}

function isAppDocument(request) {
  const url = new URL(request.url);

  return (
    url.pathname.endsWith("/marvel-chat/") ||
    url.pathname.endsWith("/marvel-chat/index.html") ||
    url.pathname.endsWith("/marvel-chat/")
  );
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Never intercept Firebase / Google requests.
  if (isFirebaseRequest(url)) {
    return;
  }

  // Only handle this GitHub Pages origin.
  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * IMPORTANT:
   * Always try the network first for the actual Marvel Chat
   * application document.
   *
   * This prevents an installed PWA from unnecessarily launching
   * an old cached index.html when the new version is available.
   */
  if (isAppDocument(event.request)) {
    event.respondWith(
      fetch(event.request, {
        cache: "no-store"
      })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, copy))
              .catch(() => {});
          }

          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );

    return;
  }

  /*
   * Other same-origin files:
   * network first, cache as an offline fallback.
   */
  event.respondWith(
    fetch(event.request, {
      cache: "no-store"
    })
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, copy))
            .catch(() => {});
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
