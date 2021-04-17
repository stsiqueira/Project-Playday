//Js file to add versioning on styles that avoids refering cached version
var head = document.getElementsByTagName('HEAD')[0]; 
var link = document.createElement('link');
// var versionUpdate = (new Date()).getTime(); 
var versionUpdate = 1.3; 
link.rel = 'stylesheet'; 
link.type = 'text/css';
link.href = '../style.css?v='+ versionUpdate; 
head.appendChild(link); 