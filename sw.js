const cacheName = "v1";
const urlsToCache = [ "./index.html", "./style.css", "./"];
self.addEventListener( 'install', ( event ) => {
    console.log(`SW: Event fired: ${ event.type }`);
    event.waitUntil(// waitUntil tells the browser to wait for this to finish
        caches.open( cacheName )//caches is a global object representing CacheStorage
        .then( ( cache ) => { // open the cache with the name cacheName*
            return cache.addAll( urlsToCache );      // pass the array of URLs to cache**
        }));
});

self.addEventListener( 'activate', ( event ) => {
    console.log(`SW: Event fired: ${ event.type }`);
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

// this.addEventListener('fetch', function (event) {
//     console.log( `SW: Fetching ${event.request.url}` );
//     // it can be empty if you just want to get rid of that error
// });

self.addEventListener( 'fetch', ( event ) => {
    console.log(`SW: Fetch handler`, event.request.url );
    event.respondWith(
        caches.match( event.request ).then( ( response ) => { //check the caches
            return response ||  fetch( event.request ); //
        })
    );
});