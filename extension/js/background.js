function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

// chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
//     suggestions(text, function(suggestions) {
//         var res = [];
//         var i;
//         for (i = 0; i < suggestions.length; i++) {
//             var elem = suggestions[i];
//             res.push({content: elem.url, description: escape(elem.title)});
//         }
//         suggest(res);
//     });
// });

// chrome.omnibox.onInputEntered.addListener(function(url) {
//     navigate(url);
// });

// chrome.runtime.onMessage.addListener(function(data, sender, sendRespones) {
//     // data is from message
// });
