"use strict";
var zlib = require('zlib');
function serializeFrames(frames, callback) {
    if (!frames)
        return callback(undefined, undefined);
    if (Array.isArray(frames))
        frames = JSON.stringify(frames);
    var buffer = Buffer.from(frames);
    zlib.deflate(buffer, function (err, result) {
        if (err)
            callback(err, undefined);
        else
            callback(undefined, result.toString('base64'));
    });
}
exports.serializeFrames = serializeFrames;
function deserializeFrames(frames, callback) {
    if (typeof (frames) === 'string') {
        var buffer = Buffer.from(frames, 'base64');
        zlib.inflate(buffer, function (err, result) {
            if (err)
                callback(err, undefined);
            callback(err, result.toString());
        });
    }
    else if (Array.isArray(frames))
        callback(undefined, JSON.stringify(frames));
    else
        throw new Error('Unexpected type');
}
exports.deserializeFrames = deserializeFrames;
//# sourceMappingURL=frame-utils.js.map