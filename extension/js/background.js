var BLACKLIST = ['https://www.google.com/_/chrome/newtab'];
var LT = function(a,b) {return a < b};
var GT = function(a,b) {return a > b};
var LT_OBJ = function(a,b) {
    return a.time < b.time;
}

var GT_OBJ = function(a,b) {
    return a.time > b.time;
}


chrome.omnibox.onInputChanged.addListener(omnibarHandler);
chrome.runtime.onMessage.addListener(handleMessage);
MAX_MEM = 100000000; // bytes

function init() {
    window.preloaded = [];
    window.memo = {};
    chrome.storage.local.get('index', function(items) {
        window.timeIndex = items['index'];
        if (index === undefined) {
            window.timeIndex = [];
            chrome.storage.local.get(null, function(items) {
                for (var key in items) {
                    timeIndex.push(item[key].time);
                }

                timeIndex.sort(function(a,b) {return a.time - b.time}); // soonest last
                makePreloaded(timeIndex);
                chrome.storage.local.set('index':timeIndex);
            });

        } else {
            makePreloaded(timeIndex);
        }
    });
}

function makePreloaded(index) {
    var preloaded_index = [];
    var millis = +CUTOFF_DATE;
    var j = Math.floor(binarySearch(index, millis, LT, GT, 0, index.length));
    for (var j = i; j < index.length; j++) {
        preloaded_index.push(index[i]);
    }

    chrome.storage.local.get(preloaded_index, function(items) {
        window.preloaded = items;
    });
}

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function handleMessage(data, sender, sendRespones) {
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

        timeIndex.append(time);
        preloaded.append(data);
        chrome.storage.local.set('index':timeIndex);
    }
}

function omnibarHandler(text, suggest) {
    dispatchSuggestions(text, function(suggestions, shouldDate) {
        var res = [];
        var i;
        for (i = 0; i < suggestions.length; i++) {
            var elem = suggestions[i];
            var description = "<url>" + escape(elem.url) + "</url> "
            if (shouldDate) {
                var date = new Date(elem.time);
                var fmt = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear().toString().substring(2,4);
                description += ' on <match>' + escape(fmt) + '</match> ';
            }

            description += '- ' + escape(elem.title);
            res.push({content:elem.url, description:description});
        }

        suggest(res);
    });
}

function shouldArchive(data) {
    for (var url in BLACKLIST) {
        if (data.url.indexOf(url) > -1) return false;
    }

    return true;
}

function makeSuggestions(keywords, candidates, cb) {
    var res = [];
    var keywordsLen = keywords.length;
    var j = 0;
    for (var i = 0; i < candidates.length; i++) {
        var text = candidates[i].text;
        for (var i = 0; i < keywordsLen; i++) {
            if (text.indexOf(keywordsLen[i]) == -1) {
                break;
            }
        }

        res.append(candidates[i]);
        j += 1;
        if (j == 5) {
            break;
        }
    }

    cb(res);
}

MIN_KEYWORD_LEN = 4;
MIN_COMPONENT_KEYWORD_LEN = 3;

function dispatchSuggestions(text, cb) {
    var query = makeQueryFromText(text);
    query.text = text;
    if (query.after >= query.before) return;

    if (max(keywords.map(function(x){x.length})) < MIN_KEYWORD_LEN) {
        return;
    }

    keywords = keywords.reduce(function(x) {return x.length >= MIN_COMPONENT_KEYWORD_LEN});
    keywords.sort(function(a,b){return b.length-a.length});

    if (query.after >= CUTOFF_DATE) {
        var start = Math.floor(binarySearch(preloaded, +query.after, LT_OBJ,
                                            GT_OBJ, 0, preloaded.length));
        var end;
        if (query.before) {
            end = Math.ceil(binarySearch(preloaded, +query.before, LT_OBJ,
                                         GT_OBJ, 0, preloaded.length));
        } else {
            end = preloaded.length;
        }

        makeSuggestions(keywords, preloaded.slice(start, end), cb)
    } else {
        var start = Math.floor(binarySearch(timeIndex, +query.after, LT,
                                            GT, 0, timeIndex.length));
        var end;
        if (query.before) {
            end = Math.ceil(binarySearch(timeIndex, +query.before, LT,
                                         GT, 0, timeIndex.length));
        } else {
            end = timeIndex.length;
        }

        chrome.storage.local.get(timeIndex.slice(start, end), function(items) {
            makeSuggestions(keywords, items, cb);
        });
    }
}

function binarySearch(arr, value, lt, gt, i, j) {
    if (Math.abs(j - i) <= 1) {
        return (i + j)/2;
    }
    
    var m = Math.floor((i + j)/2)
    var cmpVal = arr[m];
    if (gt(cmpVal, value)) {
        j = m;
    } else if (lt(cmpVal, value)){
        i = m;
    } else {
        return m;
    }
    return binarySearch(arr, value, i, j);
}
