window.addEventListener('click',function(e){
  if(e.target.href!==undefined && e.target.href.length > 0){
    chrome.tabs.create({url:e.target.href})
  }
});

window.addEventListener('DOMContentLoaded', function() {
  var quickBlacklist = document.getElementById('quick-blacklist');
  quickBlacklist.addEventListener('click', function() {
    disableIfBlacklisted(true);
  });
});

function disableIfBlacklisted(add=false){
  var quickBlacklist = document.getElementById('quick-blacklist');
  chrome.storage.local.get(['blacklist'], function(items) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var tabUrl = tabs[0].url;
      var blacklist = items['blacklist'];
      if(!blacklist['SITE'].includes(tabUrl) && add){
        blacklist['SITE'].push(tabUrl)
        chrome.storage.local.set({'blacklist':blacklist});
      }
      if(blacklist['SITE'].includes(tabUrl)){
        quickBlacklist.classList.add('disabled');
      }
    });
  });
}

disableIfBlacklisted(false);
