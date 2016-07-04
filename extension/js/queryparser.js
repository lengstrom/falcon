var BEFORE = /(\s|^)before:/i;
var AFTER = /(\s|^)after:/i;
var NEGATIVE = /(\s|^)-/i;
var QUOTEREGEX = /["']/;
var DEFAULT_DATE_OFFSET = 14;
var PARSERS = [parseDate, parseNegative, parseExact, parseKeywords, normalize];

var CUTOFF_DATE = new Date();
CUTOFF_DATE.setDate(CUTOFF_DATE.getDate() - DEFAULT_DATE_OFFSET);

function extractTextBtwChars(i, text) { // i is index of first char
    var ch = text[i];
    if (!ch.match(QUOTEREGEX)) {
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
    var textLen = text.length;
    var quoteMap = new Array(textLen);
    var currQuote = false;
    var i = 0;
    while (i < textLen) {
        var ch = text[i];
        if (currQuote == false) {
            if (ch.match(QUOTEREGEX) != null) {
                currQuote = ch;
            }
        } else {
            if (ch == currQuote) {
                currQuote = false;
            }
        }

        quoteMap[i] = currQuote == false ? 0 : 1;
        i += 1;
    }

    var res = text.match(regex);
    var offset = 0;
    var pos;
    if (res != null) {
        pos = res.index;
    } else {
        pos = 0;
    }

    while (res != null && quoteMap[pos] == 1) {
        offset += res.index + res.length;
        res = text.substring(offset+1,text.length).match(regex);
        pos = res.index + 1 + offset
    }

    if (res == null) return [false, false];
    if (offset > 0) res.index += offset + 1;

    var i = res.index + res[0].length;
    while (text[i] == ' ') {i += 1};
    if (i >= textLen) {
        return [false, false];
    }

    if (text[i].match(QUOTEREGEX)) {
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
        var [match, textTmp] = getArgumentForRegex(text, regexes[arg]);
        if (match != false) {
            var date = chrono.parseDate(match);
            if (date != null) {
                query[arg] = date;
                query.shouldDate = true;
            }
            text = textTmp;
        }
    }

    query.text = text;
    return query;
}

function parseNegative(query) {
    // chrono.parseDate('An appointment on Sep 12-13')
    var text = query.text;
    while (true) {
        var [match, textTmp] = getArgumentForRegex(text, NEGATIVE);
        if (match != false) {
            query.negative.push(match);
            text = textTmp;
        } else {
            break;
        }
    }

    query.text = text;
    return query;
}

function parseKeywords(query) {
    var text = query.text;
    query.keywords = query.keywords.concat(query.text.trim().split(/\s+/));
    return query;
}

function normalize(query) {
    query.keywords = query.keywords.map(processPageText);
    return query;
}

function makeQueryFromText(text) {
    var query = {
        text:text,
        before: false,
        after: CUTOFF_DATE,
        keywords: [],
        negative:[],
        shouldDate: false // has the date been set 
    }
    
    function reducer(prev, curr, index, arr) {
        return curr(prev);
    }
    
    return finalizedQuery = PARSERS.reduce(reducer, query);
}
