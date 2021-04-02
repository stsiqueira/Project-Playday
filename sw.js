const cacheName = "v1";
const urlsToCache = [ 
    "./index.html",
    "./style.css",
    "./js/home.js",
    "./html/home.html",
    "./html/badminton-article.html"
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

self.addEventListener( 'fetch', ( event ) => {
    // console.log(window.localStorage);
    
    event.respondWith(
        caches.match( event.request ).then( ( response ) => { //check the caches
            return response ||  fetch( event.request ); //
        })
    );
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         fetch(event.request).catch(function() {
//             return caches.match(event.request);
//         })
//     );
// });