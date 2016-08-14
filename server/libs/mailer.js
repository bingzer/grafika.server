"use strict";
var nodemailer = require('nodemailer');
var winston = require('winston');
var fs = require('fs-extra');
var path = require('path');
var $q = require('q');
var config = require('../configs/config');
var mailTransporter = nodemailer.createTransport({
    name: config.setting.$server.$mailService,
    host: config.setting.$server.$mailSmtp,
    port: config.setting.$server.$mailPort,
    auth: {
        user: config.setting.$server.$mailUser,
        pass: config.setting.$server.$mailPassword
    }
});
function sendVerificationEmail(user) {
    var deferred = $q.defer();
    var url = config.setting.$server.$url + '?action=verify&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    var opts = { title: 'Please activate your account', user: user.email, link: url, privacyUrl: config.setting.$server.$url + 'privacy', homeUrl: config.setting.$server.$url };
    var promises = $q.allSettled([
        readTemplate('verification-template.txt', opts),
        readTemplate('verification-template.html', opts)]);
    promises.then(function (results) {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject("fail");
        var mailOptions = {
            from: config.setting.$server.$mailFrom,
            to: user.email,
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
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
    var url = config.setting.$server.$url + '?action=reset-pwd&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    var opts = { title: 'Grafika: Password Reset', user: user.email, link: url, privacyUrl: config.setting.$server.$url + 'privacy', homeUrl: config.setting.$server.$url };
    var promises = $q.allSettled([
        readTemplate('resetpwd-template.txt', opts),
        readTemplate('resetpwd-template.html', opts)]);
    promises.then(function (results) {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject('fail');
        var mailOptions = {
            from: config.setting.$server.$mailFrom,
            to: user.email,
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
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
            if (opts.title)
                data = data.replace(/{{email.title}}/gi, opts.title);
            if (opts.user)
                data = data.replace(/{{email.user}}/gi, opts.user);
            if (opts.link)
                data = data.replace(/{{email.link}}/gi, opts.link);
            if (opts.privacyUrl)
                data = data.replace(/{{email.privacyUrl}}/gi, opts.privacyUrl);
            if (opts.homeUrl)
                data = data.replace(/{{email.homeUrl}}/gi, opts.homeUrl);
            deferred.resolve(data);
            winston.info("Template [OK]");
        }
    });
    return deferred.promise;
}
//# sourceMappingURL=mailer.js.map