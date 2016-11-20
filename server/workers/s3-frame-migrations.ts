import { IAnimation, Animation } from "../models/animation";
import { AwsFrames } from "../libs/aws"
import * as winston from "winston";
import * as zlib from "zlib";
import * as request from "request";

import * as mongooseConfig from '../configs/mongoose';

const awsFrames = new AwsFrames();
const failedToMigrate = [];

let count = 0;
let length = 0;

export function migrate() {
    Animation.find({ frames: { $exists: true }}, (err, results) => {
        length = results.length;
        //length = 10;
        for(let i = 0; i < length; i++){
            migrateAnimation(results[i]);
        }
    });
}


function migrateAnimation(animation: IAnimation) {
    winston.info("Migrating: " + animation._id);

    Animation.findById(animation._id, { frames: 1 }).lean().exec((err, res: any) => {
        let frames = res.frames;
        awsFrames.generatePOSTUrl(animation, (err, signedUrl) => {
            if (err) {
                failedToMigrate.push(animation);
            }

            // let buffer: Buffer = zlib.deflateSync(Buffer.from(frames));
            // let xreq = request.put(signedUrl.signedUrl);
            // xreq.on("request", (clientReq) => {
            //     clientReq.removeHeader("Authorization");
            // });
            // xreq.on("data", (data) => {
            //     winston.info(animation._id + "data: " + data.toString());
            // });
            // xreq.on("complete", (resp) => {
            //     winston.info(animation._id + "res: " + resp.toString());
            // });
            // xreq.end(buffer);

            let buffer = Buffer.from(frames, "base64");
            let xreq = request.put(signedUrl.signedUrl, { body: buffer });
            xreq.setHeader("Content-Type", "application/json");
            xreq.setHeader("Content-Encoding", "deflate");
            xreq.on("data", (data) => {
                winston.info(animation._id + " data: " + data.toString());
            });
            xreq.on("error", (err) => {
                failedToMigrate.push(animation);
                winston.error(animation._id + " error", err);
            })
            xreq.on("complete", (data) => {
                count++;
                let completed = "[" + Math.floor((count / length) * 100) + "%] "; 
                winston.info(completed + animation._id + " complete: " + data.toString());
            });
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

winston.info("This is a job to migrate all frame data from mongodb to AWS");
winston.info("Environment needed:");
winston.info("* server_database_url");
winston.info("* auth_aws_bucket");
winston.info("* auth_aws_folder");
winston.info("* auth_aws_id");
winston.info("* auth_aws_secret");

mongooseConfig.initialize();
migrate();