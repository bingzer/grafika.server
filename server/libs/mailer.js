"use strict";
var nodemailer = require("nodemailer");
var winston = require("winston");
var fs = require("fs-extra");
var path = require("path");
var $q = require("q");
var config = require("../configs/config");
var mailTransporter = nodemailer.createTransport({
    name: config.setting.$server.$mailService,
    host: config.setting.$server.$mailSmtp,
    port: config.setting.$server.$mailPort,
    auth: {
        user: config.setting.$server.$mailUser,
        pass: config.setting.$server.$mailPassword
    }
});
exports.mailTransporter = mailTransporter;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendAnimationCommentEmail(animation, user, comment) {
    var deferred = $q.defer();
    var url = config.setting.$content.$url + 'animations/' + animation._id;
    var thumbnail = config.setting.$server.$url + 'animations/' + animation._id + '/thumbnail';
    var opts = {
        title: 'New comment on ' + animation.name, user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url,
        name: animation.name, comment: comment.text, thumbnailUrl: thumbnail
    };
    var promises = $q.allSettled([
        readTemplate('animation-comment.txt', opts),
        readTemplate('animation-comment.html', opts)
    ]);
    promises.then(function (results) {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject("fail");
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.setting.$server.$mailFrom,
            to: user.email,
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                winston.error("Unable to sent message", error);
                deferred.reject(error);
            }
            else {
                winston.info('Message sent: ' + info.response);
                deferred.resolve();
            }
        });
    });
    return deferred.promise;
}
exports.sendAnimationCommentEmail = sendAnimationCommentEmail;
function sendVerificationEmail(user) {
    var deferred = $q.defer();
    var url = config.setting.$content.$url + 'r?action=verify&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    var opts = { title: 'Please activate your account', user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url };
    var promises = $q.allSettled([
        readTemplate('verification-template.txt', opts),
        readTemplate('verification-template.html', opts)
    ]);
    promises.then(function (results) {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject("fail");
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.setting.$server.$mailFrom,
            to: user.email,
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                winston.error("Unable to sent message", error);
                deferred.reject(error);
            }
            else {
                winston.info('Message sent: ' + info.response);
                deferred.resolve();
            }
        });
    });
    return deferred.promise;
}
exports.sendVerificationEmail = sendVerificationEmail;
function sendResetEmail(user) {
    var deferred = $q.defer();
    var url = config.setting.$content.$url + 'r?action=reset-pwd&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    var opts = { title: 'Grafika: Password Reset', user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url };
    var promises = $q.allSettled([
        readTemplate('resetpwd-template.txt', opts),
        readTemplate('resetpwd-template.html', opts)
    ]);
    promises.then(function (results) {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject('fail');
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.setting.$server.$mailFrom,
            to: user.email,
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                winston.error("Unable to sent message", error);
                deferred.reject(error);
            }
            else {
                winston.info('Message sent: ' + info.response);
                deferred.resolve();
            }
        });
    });
    return deferred.promise;
}
exports.sendResetEmail = sendResetEmail;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function readTemplate(templateName, opts) {
    var deferred = $q.defer();
    var file = path.resolve('server/templates/' + templateName);
    winston.info('Template file: ' + file);
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            winston.error("Reading file " + file, err);
            deferred.reject(err);
        }
        else {
            var keys = Object.keys(opts);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = opts[key];
                if (value) {
                    var pattern = new RegExp('{{email.' + key + '}}', 'gi');
                    data = data.replace(pattern, value);
                }
            }
            deferred.resolve(data);
            winston.info("Template [OK]");
        }
    });
    return deferred.promise;
}
//# sourceMappingURL=mailer.js.map