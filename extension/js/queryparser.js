var BEFORE = /(\s|^)before:/i;
var AFTER = /(\s|^)after:/i;
var DEFAULT_DATE_OFFSET = 14;
var PARSERS = [parseDate, parseExact, parseKeywords, normalize];

function extractTextBtwChars(i, text) { // i is index of first char
    var ch = text[i];
    if (!ch.match(/['"]/)) {
        ch = " ";
    }
    var next = text.indexOf(ch, i+1);
    if (next > -1) {
        var matched = text.substring(i+1, next);
        text = text.substring(0,i) + " " + text.substring(next+1, text.length);
        return [matched, text];
    } else {
        return [false, false];
    }
}

function getArgumentForRegex(text, regex) {
    var res = text.match(regex);
    if (res == null) return [false, false];

    var i = res.index + res[0].length;
    while (text[i] == ' ') {i += 1};
    if (text[i].match(/["']/)) {
        var [matched, text] = extractTextBtwChars(i, text);
    } else {
        var [matched, text] = extractTextBtwChars(i-1, text);
    }

    if (text == false) {
        return [false, false];
    }

    text = text.substring(0, res.index) + " " + text.substring(res.index + res[0].length, text.length);
    return [matched, text];
}

function getNextQuote(i, text) {
    var p1 = text.indexOf('"',i);
    var p2 = text.indexOf("'",i);
    if (p1 == -1) {
        return p2;
    }

    if (p2 == -1) {
        return p1;
    }

    return Math.min(p1, p2);
}

function parseExact(query) {
    var text = query.text;
    var i = getNextQuote(0, text);
    var next;
    while (i > -1) {
        var [matched, text] = extractTextBtwChars(i, text);
        if (text == false) {
            return query;
        }

        query.keywords.push(matched);
        query.text = text;
        i = getNextQuote(i, text);
    }

    query.text = text;
    return query;
}

function parseDate(query) {
    // chrono.parseDate('An appointment on Sep 12-13')
    var text = query.text;
    var regexes = {'before':BEFORE, 'after':AFTER};
    for (var arg in regexes) {
        var [match, text] = getArgumentForRegex(text, regexes[arg]);
        if (match != false) {
            var date = chrono.parseDate(match);
            if (date != null) {
                query[arg] = date;
            }
        }
    }

    query.text = text;
    return query;
}

function parseKeywords(query) {
    var text = query.text;
    query.keywords = query.keywords.concat(query.text.trim().split(/\s+/));
    delete query.text;
    return query;
}

function normalize(query) {
    query.keywords = query.keywords.map(processPageText);
    return query;
}

function makeQueryFromText(text) {
    var date = new Date();
    date.setDate(date.getDate() - DEFAULT_DATE_OFFSET);
    var query = {
        text:text,
        before: undefined,
        after: date,
        keywords: []
    }
    
    function reducer(prev, curr, index, arr) {
        return curr(prev);
    }
    
    return finalizedQuery = PARSERS.reduce(reducer, query);
}
