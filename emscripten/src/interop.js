var ALPHABETLENGTH = 256;
var buildBMSTable = _buildBMSTable;
var BMSMatch = _BMSMatch

function wrapString(str) {
    var buffer = Module._malloc(str.length + 1);
    Module.writeStringToMemory(str, buffer);
    return buffer;
}

function wrapInt32Array(length) {
    var memo = new Int32Array(ALPHABETLENGTH);
    var memoSize = memo.BYTES_PER_ELEMENT * ALPHABETLENGTH;
    var memoPointer = Module._malloc(memoSize);
    var shifted = memoPointer >> 2;
    Module.HEAP32.set(memo, shifted);
    var view = Module.HEAP32.subarray(shifted, shifted + ALPHABETLENGTH);
    return [view, memoPointer];
}
