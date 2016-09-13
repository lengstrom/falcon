window.addEventListener('click',function(e){
  if(e.target.href!==undefined && e.target.href.length > 0){
    chrome.tabs.create({url:e.target.href})
  }
});

window.addEventListener('DOMContentLoaded', function() {
    var quickBlacklist = document.getElementById('quick-blacklist');
    quickBlacklist.addEventListener('click', function() {
        //open blacklist2.js
        //output window.target.href to blacklist2.js
        close blacklist2.js
    });
});
