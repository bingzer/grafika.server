import * as zlib from 'zlib';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Serialize 'frames' into deflated-base64 encoded string.
 */
export function serializeFrames(frames: [any] | string, callback: (err, result: string) => void) {
    if (!frames) return callback(undefined, undefined);

    if (Array.isArray(frames))
        frames = JSON.stringify(frames);

    let buffer = Buffer.from(<string>frames);
    zlib.deflate(buffer, (err, result) => {
        if (err) callback(err, undefined);
        else callback(undefined, result.toString('base64'));
    });
}

/**
 * Deserialize 'frames' from deflated-base64 encoded string to array of Frame
 */
export function deserializeFrames(frames: [any] | string, callback: (err, result: string) => void) {
    if (typeof(frames) === 'string'){
        let buffer = Buffer.from(<string>frames, 'base64');
        zlib.inflate(buffer, (err, result) => {
            if (err) callback(err, undefined);
            
            callback(err, result.toString());
        });
    }
    else if (Array.isArray(frames))
        callback(undefined, JSON.stringify(frames));
    else throw new Error('Unexpected type');
}