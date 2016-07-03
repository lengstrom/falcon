var pat = "nom";
var patPointer = wrapString(pat);
var [view, memoPointer] = wrapInt32Array(ALPHABETLENGTH);
buildBMSTable(patPointer, memoPointer);

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

assert(BMSMatch(patPointer, wrapString("omnomom"), memoPointer));
assert(BMSMatch(patPointer, wrapString("nomom"), memoPointer));
assert(BMSMatch(patPointer, wrapString("ommmmnomnomom"), memoPointer));
assert(!BMSMatch(patPointer, wrapString("train"), memoPointer));
assert(!BMSMatch(patPointer, wrapString("cow"), memoPointer));
assert(!BMSMatch(patPointer, wrapString("m"), memoPointer));
assert(!BMSMatch(patPointer, wrapString("n"), memoPointer));
assert(!BMSMatch(patPointer, wrapString("aljoiaoiweuoiralkjeroiajsldjfoaisjdfljalclijalsidf"), memoPointer));
