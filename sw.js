const CACHE_NAME = 'risotrack-cache-v1';
const urlsToCache = [
  './', // index.html
  './manifest.json',
  // Aggiungi qui gli assets essenziali come le tue icone e i file CSS/JS locali se li avessi
  // 'style.css',
  // 'app.js', 
  'https://cdn.tailwindcss.com', // Tailwind CDN (meglio se si usa la versione locale)
  'https://d3js.org/d3.v7.min.js', // D3.js
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap', // Font
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js', // Firebase JS
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Installa il Service Worker e memorizza la cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.error('Errore in cache.addAll:', error))
  );
});

// Intercetta le richieste e usa la cache se disponibile
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - restituisce la risposta dalla cache
        if (response) {
          return response;
        }
        // Nessun hit nella cache - fetch dalla rete
        return fetch(event.request);
      })
  );
});

// Aggiorna e pulisci la vecchia cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});