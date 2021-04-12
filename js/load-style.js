// Get HTML head element
var head = document.getElementsByTagName('HEAD')[0]; 
  
// Create new link Element
var link = document.createElement('link');
var versionUpdate = (new Date()).getTime(); 
// var versionUpdate = 1.1; 
// set the attributes for link element 
link.rel = 'stylesheet'; 
link.type = 'text/css';
link.href = '../style.css?v='+ versionUpdate; 
// Append link element to HTML head
head.appendChild(link); 