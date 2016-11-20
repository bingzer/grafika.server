"use strict";
var animation_1 = require("../models/animation");
var aws_1 = require("../libs/aws");
var winston = require("winston");
var request = require("request");
var awsFrames = new aws_1.AwsFrames();
function migrate() {
    animation_1.Animation.find({ frames: { $exists: true } }, function (err, results) {
        var length = results.length;
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
            xreq.on("complete", function (data) {
                winston.info(animation._id + " complete: " + data.toString());
            });
        });
    });
}
//# sourceMappingURL=s3-frame-migrations.js.map