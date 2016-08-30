"use strict";
function safeParseInt(num) {
    var i = parseInt(num);
    if (isNaN(i))
        i = -1;
    return i;
}
exports.safeParseInt = safeParseInt;
function randomlyPick(any) {
    var randomIndex = Math.floor(Math.random() * any.length);
    return any[randomIndex];
}
exports.randomlyPick = randomlyPick;
//# sourceMappingURL=utils.js.map