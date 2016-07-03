// var pat = "nom";
// var patPointer = wrapString(pat);
// var [view, memoPointer] = wrapInt32Array(ALPHABETLENGTH);
// buildBMSTable(patPointer, memoPointer);

// function assert(condition, message) {
//     if (!condition) {
//         throw message || "Assertion failed";
//     }
// }

// debugger;

// function getTheFrenchRevolution() {
//     return 
// }

// function assert(condition, message) {
//     if (!condition) {
//         throw message || "Assertion failed";
//     }
// }


// pat = "nom";
// table = buildBMSTable(pat);
// assert(BMSMatch(pat, "omnomom", table));
// assert(BMSMatch(pat, "nomom", table));
// assert(BMSMatch(pat, "ommmmnomnomom", table));
// assert(!BMSMatch(pat, "train", table));
// assert(!BMSMatch(pat, "cow", table));
// assert(!BMSMatch(pat, "m", table));
// assert(!BMSMatch(pat, "n", table));
// assert(!BMSMatch(pat, "aljoiaoiweuoiralkjeroiajsldjfoaisjdfljalclijalsidf", table));



function buildBMSTable(pat) {
    var memo = new Uint8Array(127);
    var patLen = pat.length;
    for (var i = 0; i < 127; i++) {
        memo[i] = patLen;
    }

    for (var i = 0; i < patLen - 1; i++) {
        memo[pat[i].charCodeAt()] = patLen - i - 1;
    }

    return memo;
}

function BMSMatch(pat, txt, memo) {
    var patLen = pat.length;
    var txtLen = txt.length;
    var w = patLen - 1;
    var shift;

    while (w < txtLen) {
        shift = 0;
        while (txt[w-shift]==pat[patLen-1-shift]) {
            shift += 1;
            if (patLen == shift) return 1;
        }
        w += memo[txt[w]];
    }
    return 0;
}


// frenchRevolution = "frenchRevolution + frenchRevolution + frenchRevolution + frenchRevolution"

var iterations = 1;
var pat = "customizeable";
var patArr = new Uint8Array(pat.length);

for (var i = 0; i < pat.length; i++) {
    patArr[i] = pat.charCodeAt(i);
}

var table = buildBMSTable(pat);
frenchRevolution = frenchRevolution + frenchRevolution
console.time('vanillajs')
for (var i = 0; i < iterations; i++) {
x    var text = frenchRevolution.slice(); //.slice();
    var res = text.indexOf(pat);
}
console.timeEnd('vanillajs')


console.time('custom');
text = frenchRevolution; //.slice();
textArr = new Uint8Array(frenchRevolution.length);

for (var i = 0; i < text.length; i++) {
    textArr[i] = text.charCodeAt(i);
}

for (i = 0; i < iterations; i++) {
    var text = frenchRevolution.slice()
    var res = BMSMatch(patArr, textArr, table);
}
console.timeEnd('custom');

