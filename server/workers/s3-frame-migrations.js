"use strict";
var animation_1 = require("../models/animation");
var aws_1 = require("../libs/aws");
var winston = require("winston");
var zlib = require("zlib");
var request = require("request");
var awsFrames = new aws_1.AwsFrames();
function migrate() {
    animation_1.Animation.find({ frames: { $exists: true } }, function (err, results) {
        for (var i = 0; i < results.length; i++) {
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
            var buffer = zlib.deflateSync(Buffer.from(frames));
            var headers = [
                { "Content-Type": "application/json" },
                { "Content-Encoding": "deflate" }
            ];
            var xreq = request.put(signedUrl.signedUrl, {
                headers: headers,
                body: buffer
            }, function (err, res) {
                winston.info("Migrated: " + animation._id);
            });
        });
    });
}
//# sourceMappingURL=s3-frame-migrations.js.map