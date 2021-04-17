const staticCacheName = 'site-static-v2';
const assets = [
	"./index.html",
	"./style.css",
	"./html/offline.html",
	"./html/articles/badminton-article.html",
	"./html/articles/tennis-article.html",
	"./html/articles/volleyball-article.html",
	"./img/logo.png",
	"./img/home-screen/hero-img.png",
	"./img/home-screen/tennis-main.png",
	"./img/home-screen/badminton-main.png",
	"./img/home-screen/volleyball-main.png",
	"./img/articles-section/volleyball-1.jpg",
	"./img/articles-section/volleyball-2.jpg",
	"./img/articles-section/volleyball-3.jpg",
	"./img/articles-section/volleyball-hero-image.jpg",
	"./img/articles-section/tennis-1.jpg",
	"./img/articles-section/tennis-2.jpg",
	"./img/articles-section/tennis-3.jpg",
	"./img/articles-section/tennis-hero-image.jpg",
	"./img/articles-section/badminton-1.jpg",
	"./img/articles-section/badminton-2.jpg",
	"./img/articles-section/badminton-3.jpg",
	"./img/articles-section/badminton-hero-image.jpg",
	"./js/common.js",
	"./favicon.ico",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js",
	"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
	"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
];


// install event
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
		return cache.addAll(assets);
		})
	);
});

// activate event
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});

// fetch event
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
		  	return cacheRes || fetch(evt.request)
		}).catch(() => {
			return caches.match("./html/offline.html");
		})
	);
});