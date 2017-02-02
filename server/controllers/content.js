"use strict";
var config = require("../configs/config");
var winston = require("winston");
var mailer_1 = require("../libs/mailer");
function feedback(req, res, next) {
    var content = '<strong>Subject  :</strong><br/>' + req.body.subject + '<br/>' +
        '<strong>Category :</strong><br/>' + req.body.category + '<br/>' +
        '<strong>Feedback :</strong><br/>' + req.body.content + '<br/>' +
        '<strong>Username :</strong><br/>' + (req.user ? req.user.username : 'anonymous') + '<br/>' +
        '<strong>Email    :</strong><br/>' + (req.user ? req.user.email : 'anonymous') + '<br/>';
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: config.setting.$server.$mailFrom,
        to: config.setting.$server.$mailFrom,
        subject: 'Feedback: ' + req.body.subject,
        html: content
    };
    mailer_1.mailTransporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            winston.error("Unable to sent message", err);
            next(err);
        }
        else {
            winston.info('Message sent: ' + info.response);
            res.sendStatus(201);
        }
    });
}
exports.feedback = feedback;
//# sourceMappingURL=content.js.map