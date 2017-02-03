"use strict";
var config = require("../configs/config");
var winston = require("winston");
var mailer_1 = require("../libs/mailer");
var animation_1 = require("../models/animation");
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
function buildSitemap(req, res, next) {
    animation_1.Animation.find({ isPublic: true }).limit(100).sort({ views: -1 }).exec(function (err, anims) {
        if (err)
            return next(err);
        var xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        for (var i = 0; i < anims.length; i++) {
            xml += createUrlElement(anims[i]);
        }
        xml += '</urlset>';
        res.contentType('application/xml');
        res.send(xml);
    });
}
exports.buildSitemap = buildSitemap;
//////////////////////////////////////////////////////////////////////
function createUrlElement(anim) {
    var xml = '<url>';
    xml += "<loc>" + config.setting.$server.$url + "animations/" + anim._id + "/seo</loc>";
    xml += '<changefreq>weekly</changefreq>';
    xml += '</url>';
    return xml;
}
//# sourceMappingURL=content.js.map