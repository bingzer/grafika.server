"use strict";
function notNullOrEmpty(any, name) {
    if (any == null)
        throw new Error(name);
    if (any.length == 0)
        throw new Error(name);
}
exports.notNullOrEmpty = notNullOrEmpty;
//# sourceMappingURL=ensure.js.map