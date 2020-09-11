let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
    'index.html',
    'icons',
    'manifest.json',
    'weather.css',
    'weather.js'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
