import * as nodemailer from 'nodemailer';
import * as winston from 'winston';

import fs     = require('fs-extra');
import path   = require('path');
import $q      = require('q');
import config = require('../configs/config');
import { IUser } from '../models/user';

const mailTransporter = nodemailer.createTransport({
    name: config.setting.$server.$mailService,
	host: config.setting.$server.$mailSmtp,
    port: config.setting.$server.$mailPort,
	auth: {
		user: config.setting.$server.$mailUser,
		pass: config.setting.$server.$mailPassword
	}
});

export { mailTransporter };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function sendAnimationCommentEmail(animation: Grafika.IAnimation, user: Grafika.IUser, comment: { text: string, id: string, user?: string }) : $q.Promise<any> {
    let deferred = $q.defer();
    let url = config.setting.$content.$url + 'animations/' + animation._id;
    let thumbnail = config.setting.$server.$url + 'animations/' + animation._id + '/thumbnail';
    
    let opts = { 
        title: 'New comment on ' + animation.name, user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url,
        name: animation.name, comment: comment.text, thumbnailUrl: thumbnail
    };
    let promises = $q.allSettled([
        readTemplate('animation-comment.txt', opts), 
        readTemplate('animation-comment.html', opts) ]);
    promises.then((results) => {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject("fail");
        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: config.setting.$server.$mailFrom, // sender address
            to: user.email, // list of receivers
            subject: opts.title, // Subject line
            text: results[0].value,
            html: results[1].value
        };    
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, (error, info) =>{
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


export function sendVerificationEmail(user: IUser) : $q.Promise<{}> {
    let deferred = $q.defer();
    let url = config.setting.$content.$url + 'r?action=verify&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    
    let opts = { title: 'Please activate your account', user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url };
    let promises = $q.allSettled([
        readTemplate('verification-template.txt', opts), 
        readTemplate('verification-template.html', opts) ]);
    promises.then((results) => {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject("fail");
        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: config.setting.$server.$mailFrom, // sender address
            to: user.email, // list of receivers
            subject: opts.title, // Subject line
            text: results[0].value,
            html: results[1].value
        };    
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, (error, info) =>{
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

export function sendResetEmail(user : IUser) : $q.Promise<{}> {
    let deferred = $q.defer();
    let url = config.setting.$content.$url + 'r?action=reset-pwd&hash=' + encodeURIComponent(user.activation.hash) + '&user=' + encodeURIComponent(user.email);
    
    let opts = { title: 'Grafika: Password Reset', user: user.email, link: url, privacyUrl: config.setting.$content.$url + 'privacy', homeUrl: config.setting.$content.$url };
    let promises = $q.allSettled([
        readTemplate('resetpwd-template.txt', opts), 
        readTemplate('resetpwd-template.html', opts) ]);
    promises.then((results) => {
        if (results[0].state === 'rejected' || results[1].state === 'rejected')
            return deferred.reject('fail');
            
        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: config.setting.$server.$mailFrom, // sender address
            to: user.email, // list of receivers
            subject: opts.title,
            text: results[0].value,
            html: results[1].value
        };
        
        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, (error, info) => {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function readTemplate(templateName, opts) : $q.Promise<{}>{
    let deferred = $q.defer();
    let file = path.resolve('server/templates/' + templateName);
    winston.info('Template file: ' + file);
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            winston.error("Reading file " + file, err);
            deferred.reject(err);
        }
        else {
            let keys = Object.keys(opts);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = opts[key];

                if (value) {
                    let pattern = new RegExp('{{email.' + key + '}}', 'gi');
                    data = data.replace(pattern, value);
                }
            }

            deferred.resolve(data);
            winston.info("Template [OK]");
        }
    });
    return deferred.promise;
}