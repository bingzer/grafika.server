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
function replaceCharacters(any, find, replace) {
    if (!any)
        return any;
    if (typeof (find) === 'string')
        find = [find];
    var data;
    for (var i = 0; i < find.length; i++) {
        data = any.replace(new RegExp(find[i], 'g'), replace);
    }
    return data;
}
exports.replaceCharacters = replaceCharacters;
//# sourceMappingURL=utils.js.map