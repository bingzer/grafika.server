"use strict";
function safeParseInt(num) {
    var i = parseInt(num);
    if (isNaN(i))
        i = -1;
    return i;
}
exports.safeParseInt = safeParseInt;
//# sourceMappingURL=utils.js.map