const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
	"/",
	"./index.html",
	"./style.css",
	"./html/home.html",
	"./html/offline.html",
	"./html/articles/badminton-article.html",
	"./html/articles/tennis-article.html",
	"./html/articles/volleyball-article.html",
	"./js/home.js",
	"./js/common.js",
	"./img/logo.png",
	"./img/home-screen/hero-img.png",
	"./img/home-screen/tennis-main.png",
	"./img/home-screen/badminton-main.png",
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
	"https://kit.fontawesome.com/ef8606d888.js",
	"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
];

importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-auth.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
	apiKey: "AIzaSyCVfkLdpaLZUwFN8eMVMSptFoZfOpp1pZ8",
    authDomain: "playday-f43e6.firebaseapp.com",
    databaseURL: "https://playday-f43e6-default-rtdb.firebaseio.com",
    storageBucket: "https://console.firebase.google.com/project/playday-f43e6/storage/playday-f43e6.appspot.com/files",
    projectId: "playday-f43e6",
    storageBucket: "playday-f43e6.appspot.com",
    messagingSenderId: "732773100147",
    appId: "1:732773100147:web:13f7a6804851ac8486d806",
    measurementId: "G-TZB3NY5S6W"
});

var offline;

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		offline = "/html/offline.html";
		console.log(offline);
	} else {
		offline = "/html/log-in.html";
		console.log(offline);

	}
});


// install event
self.addEventListener('install', evt => {
	//console.log('service worker installed');
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('caching shell assets');
			cache.addAll(assets);
		})
	);
});

// activate event
self.addEventListener('activate', evt => {
	//console.log('service worker activated');
	evt.waitUntil(
		caches.keys().then(keys => {
			//console.log(keys);
			return Promise.all(keys
				.filter(key => key !== staticCacheName && key !== dynamicCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});

// // fetch event
self.addEventListener('fetch', evt => {
	if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
	  evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
		  return cacheRes || fetch(evt.request)
		}).catch(() => {
			if(evt.request.url.indexOf('.html') > -1){
			  return caches.match("./html/offline.html");
			}
		})
  )}	 
});
