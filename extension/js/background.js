var BLACKLIST = ['https://www.google.com/_/chrome/newtab'];

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    makeSuggestions(text, function(suggestions) {
        var res = [];
        var i;
        for (i = 0; i < suggestions.length; i++) {
            var elem = suggestions[i];
            var description = "<url>" + escape(elem.url) + "</url> - " + escape(elem.title);
            res.push({content:elem.url, description:description});
        }

        suggest(res);
    });
});

// chrome.omnibox.onInputEntered.addListener(function(url) {
//     navigate(url);
// });
chrome.runtime.onMessage.addListener(function(data, sender, sendRespones) {
    // data is from message
    if (data.msg === 'pageContent' && shouldArchive(data)) {
        delete data.msg;
        data.text = processPageText(data.text);

        var time = data.time;
        var keyValue = {};
        keyValue[time] = data;
        chrome.storage.local.set(keyValue, function() {
            console.log("Stored: " + data.title);
        });
    }
});

function shouldArchive(data) {
    for (var url in BLACKLIST) {
        if (data.url.indexOf(url) > -1) return false;
    }

    return true;
}

function makeSuggestions(text, cb) {
    var query = makeQueryFromText(text);
    if (query.after >= query.before) return;
    if (query.before >= (new Date()))

    
    chrome.storage.local.get(null, function(items) {
        var suggestions = [];
        var i = 0;
        var arr = [];
        var num_items = items.length;

        for (var key in items) {
            var obj = items[key];
            if (obj.text.indexOf(query) > -1) {
                suggestions.push(obj);
                if (suggestions.length == 5) {
                    break;
                }
            }
        }

        memo[query] = suggestions;
        cb(suggestions);
    });
}

