import { IAnimation, Animation } from "../models/animation";
import { AwsFrames } from "../libs/aws"
import * as winston from "winston";
import * as zlib from "zlib";
import * as request from "request";

const awsFrames = new AwsFrames();

export function migrate() {
    throw new Error();  // stop
    Animation.find({ frames: { $exists: true }}, (err, results) => {
        for(let i = 0; i < results.length; i++){
            migrateAnimation(results[i]);
        }
    });
}


function migrateAnimation(animation: IAnimation) {
    winston.info("Migrating: " + animation._id);

    Animation.findById(animation._id, { frames: 1 }).lean().exec((err, res: any) => {
        let frames = res.frames;
        awsFrames.generatePOSTUrl(animation, (err, signedUrl) => {
            let buffer = zlib.deflateSync(Buffer.from(frames));
            let headers: request.Headers = [
                { "Content-Type": "application/json" },
                { "Content-Encoding": "deflate" }
            ];
            let xreq = request.put(signedUrl.signedUrl, {
                headers: headers,
                body: buffer
            }, (err, res) => {
                winston.info("Migrated: " + animation._id);
            });
        });
    });
}