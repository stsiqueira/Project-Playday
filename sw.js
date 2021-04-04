const cacheName = "v1";
const urlsToCache = [ 
    "./index.html",
    "./style.css",
    "./html/home.html",
    "./html/offline.html",
    "./html/articles/",
    "./js/home.js",
    "./js/common.js",
    "https://kit.fontawesome.com/ef8606d888.js",
    "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    "./img/",
    ];

self.addEventListener( 'install', ( event ) => {
    // console.log(`SW: Event fired: ${ event.type }`);
    event.waitUntil(
        caches.open(cacheName)
        .then( cache => {
            return cache.addAll( urlsToCache ); 
        }));
});

self.addEventListener( 'activate', ( event ) => {
    // console.log(`SW: Event fired: ${ event.type }`);
    event.waitUntil(
        caches.keys().then( ( keyList ) => {
            return Promise.all( keyList.map( ( key ) => {
                if ( key!== cacheName  ) {    
                    return caches.delete( key );
                }}) 
            );
        })
    );
});

// self.addEventListener( 'fetch', ( event ) => {
//     // console.log(window.localStorage);
    
//     event.respondWith(
//         caches.match( event.request ).then( ( response ) => { //check the caches
//             return response ||  fetch( event.request ); //
//         })
//     );
// });

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         fetch(event.request).catch(function() {
//             // console.log(event.request);
//             return caches.match("./html/offline.html").catch(() => console.log("hiii"));
//         })
//     );
// });

// self.addEventListener('fetch', (event) => {
//     const { request } = event;
  
//     // Always bypass for range requests, due to browser bugs
//     if (request.headers.has('range')) return;
//     event.respondWith(async function() {
//       // Try to get from the cache:
//         const response = await event.preloadResponse;
//         if (response) return response;

//         try {
            
//             const cachedResponse = await caches.match(request);
//             if (cachedResponse) return cachedResponse;
//             // Otherwise, get from the network
//             return await fetch(request);

//         } catch (err) {
//             // If this was a navigation, show the offline page:
//             if (request.mode === 'navigate') {
//             return caches.match('./html/offline.html');
//             }
    
//             // Otherwise throw
//             throw err;
//         }
//         }());
//   });

self.addEventListener('fetch', function(event) {
    event.respondWith(
      // Try the cache
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('pages/404.html');
          }
          return response
        });
      }).catch(function() {
        // If both fail, show a generic fallback:
        return caches.match('html/offline.html');
      })
    );
  });