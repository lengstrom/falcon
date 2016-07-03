function buildBMSTable(pat) {
    var memo = {};
    var patLen = pat.length;
    for (var i = 32; i < 127; i++) {
        var ch = String.fromCharCode(i);
        memo[ch] = patLen;
    }
    for (var i = 0; i < patLen; i++) {
        memo[pat[i]] = patLen - i - 1;
    }
    return memo;
}

function BMSMatch(pat, txt, memo) {
    var patLen = pat.length;
    var txtLen = txt.length;
    var w = patLen - 1;
    var shift = 0;

    while (w < txtLen) {
        shift = 0;
        while (patLen > shift && txt[w - shift] == pat[patLen - 1 - shift]) {
            shift += 1;
            if (patLen == shift) {
                return 1;
            }
        }
        w += memo[text[w]];
    }
    return 0;
}
