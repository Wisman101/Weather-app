let cacheName = 'weatherCache';
let dataCacheName = 'dataWeatherCache';
let urlsToCache = [
    'weather.css',
    'weather.js',
    'index.html',
    'icons/01d.png',
    'icons/01n.png',
    'icons/02d.png',
    'icons/02n.png',
    'icons/03d.png',
    'icons/03n.png',
    'icons/04d.png',
    'icons/04n.png',
    'icons/09d.png',
    'icons/09n.png',
    'icons/10d.png',
    'icons/10n.png',
    'icons/11d.png',
    'icons/11n.png',
    'icons/13d.png',
    'icons/13n.png',
    'icons/50d.png',
    'icons/50n.png',
    'icons/unknown.png',
    'icons/background3.jpg',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    if (evt.request.url.includes('/api.openweathermap.org/')) {
        console.log('[Service Worker] Fetch (data)', evt.request.url);
        evt.respondWith(
            caches.open(dataCacheName).then((cache) => {
                return fetch(evt.request)
                    .then((response) => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    }).catch((err) => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(evt.request);
                    });
            }));
        return;
    }

     evt.respondWith(
         fetch(evt.request)
              .catch(() => {
                  return caches.open(cacheName)
                      .then((cache) => {
                          return cache.match('index.html');
                      });
              })
      );
});
