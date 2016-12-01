"use strict";
var animation_1 = require("../models/animation");
var aws_1 = require("../libs/aws");
var winston = require("winston");
var request = require("request");
var mongooseConfig = require('../configs/mongoose');
var awsFrames = new aws_1.AwsFrames();
var failedToMigrate = [];
var count = 0;
var length = 0;
function migrate() {
    animation_1.Animation.find({ frames: { $exists: true } }, function (err, results) {
        length = results.length;
        //length = 10;
        for (var i = 0; i < length; i++) {
            migrateAnimation(results[i]);
        }
    });
}
exports.migrate = migrate;
function migrateAnimation(animation) {
    winston.info("Migrating: " + animation._id);
    animation_1.Animation.findById(animation._id, { frames: 1 }).lean().exec(function (err, res) {
        var frames = res.frames;
        awsFrames.generatePOSTUrl(animation, function (err, signedUrl) {
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
            var buffer = Buffer.from(frames, "base64");
            var xreq = request.put(signedUrl.signedUrl, { body: buffer });
            xreq.setHeader("Content-Type", "application/json");
            xreq.setHeader("Content-Encoding", "deflate");
            xreq.on("data", function (data) {
                winston.info(animation._id + " data: " + data.toString());
            });
            xreq.on("error", function (err) {
                failedToMigrate.push(animation);
                winston.error(animation._id + " error", err);
            });
            xreq.on("complete", function (data) {
                count++;
                var completed = "[" + Math.floor((count / length) * 100) + "%] ";
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
//# sourceMappingURL=s3-frame-migrations.js.map