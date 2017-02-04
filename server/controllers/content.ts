import * as express from 'express';
import * as config from '../configs/config';
import * as winston from 'winston';
import * as path from 'path';

import { mailTransporter } from '../libs/mailer';
import { Animation, IAnimation } from "../models/animation";


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

export function buildSitemap(req: express.Request | any, res: express.Response, next: express.NextFunction){
	Animation.find({ isPublic : true }).limit(100).sort({ views : -1}).exec((err, anims) => {
		if (err) return next(err);

		let xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

		for (let i = 0; i < anims.length; i++){
			xml += createUrlElement(anims[i]);
		}

		xml += '</urlset>';

		res.contentType('application/xml');
		res.send(xml);
	});
}

export function getGoogleSiteVerificationFile(req: express.Request | any, res: express.Response, next: express.NextFunction){
    let file = path.resolve('server/google1d0b302936ffea82.html');
	res.contentType("text/html");
	res.sendFile(file);
}


//////////////////////////////////////////////////////////////////////

function createUrlElement(anim: IAnimation): string {
	let xml = '<url>';

	xml += `<loc>${config.setting.$server.$url}animations/${anim._id}/seo</loc>`;
	xml += '<changefreq>weekly</changefreq>';

	xml += '</url>';
	return xml;
}