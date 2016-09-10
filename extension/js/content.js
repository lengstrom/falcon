window.setTimeout((function(){
    var epochTime = (new Date()).getTime();
    var url = window.location.href;
    /*var nlparser = new NLParser()
    var docString = document.documentElement.cloneNode(deep=true).outerHTML
    var relText = document.body.innerText
    if(!((window.location.protocol + "//" + window.location.host + "/") === url)) {
        relText = nlparser.getRelevantText(docString)
        if (!relText) {
            relText = document.body.innerText
        }
        }*/
    chrome.runtime.sendMessage({
        "msg":'pageContent',
        "time":epochTime,
        "url":url,
        "text":document.body.innerText, //relText,
        "title":document.title,
    });
}), 1000);
