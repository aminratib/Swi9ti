/* ===========================================================
   SWI9TI — service-worker.js
   Service worker minimal : met en cache l'app shell (HTML/JS/
   icônes) pour un chargement instantané au retour, et affiche
   la page d'accueil même sans connexion. Les images produits
   (weserv/loremflickr) et les polices restent toujours prises
   sur le réseau pour éviter d'afficher des prix/photos périmés.
   =========================================================== */

const CACHE_NAME = 'swi9ti-shell-v1';

// Fichiers de "l'app shell" — l'ossature du site, pas les données
// dynamiques (prix Google Sheet, images produits)
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './LOGO.png',
  './LOGO1.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // On ne touche qu'aux requêtes vers notre propre site (même origine).
  // Tout le reste (CDN Tailwind, polices Google, images weserv/loremflickr,
  // Google Sheet CSV) passe directement par le réseau — c'est du contenu
  // qui doit toujours être à jour, pas mis en cache.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached); // pas de réseau → on retombe sur le cache

      // Stratégie "stale-while-revalidate" : on affiche direct la version
      // en cache (rapide), et on la met à jour en arrière-plan.
      return cached || network;
    })
  );
});