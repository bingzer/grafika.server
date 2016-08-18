import * as express from 'express';
import * as config from '../configs/config';
import * as winston from 'winston';

import { mailTransporter } from '../libs/mailer';


export function feedback(req: express.Request | any, res: express.Response, next: express.NextFunction) {    
	var content = '<strong>Subject  :</strong><br/>' + req.body.subject  + '<br/>' +
	              '<strong>Category :</strong><br/>' + req.body.category + '<br/>' +
	              '<strong>Feedback :</strong><br/>' + req.body.content  + '<br/>' +
				  '<strong>Username :</strong><br/>' + (req.user ? req.user.username : 'anonymous') + '<br/>' +
				  '<strong>Email    :</strong><br/>' + (req.user ? req.user.email : 'anonymous')    + '<br/>';
	 // setup e-mail data with unicode symbols
	var mailOptions = {
		from: config.setting.$server.$mailFrom, // sender address
		to: config.setting.$server.$mailFrom,
		subject: 'Feedback: ' + req.body.subject,
		html: content
	};
    mailTransporter.sendMail(mailOptions, (err, info) => {
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