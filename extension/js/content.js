(function(){
    var epochTime = (new Date()).getTime();
    var url = window.location.href;

    chrome.runtime.sendMessage({
        "msg":'pageContent',
        "time":epochTime,
        "url":url,
        "text":document.body.innerText,
        "title":document.title,
    });
})();
