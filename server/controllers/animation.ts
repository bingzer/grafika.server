import * as express from "express";
import * as q from 'q';
import * as fs from 'fs-extra';
import * as path from 'path';

import * as config from '../configs/config';
import * as utils from '../libs/utils';

import { Animation, IAnimation } from "../models/animation";
import { AwsAnimation, AwsResources } from '../libs/aws';
import { User, generateJwtToken, generateDisqusToken } from '../models/user';
import { sendAnimationCommentEmail } from '../libs/mailer';

export function search(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.query.term) {
        let sort = createSort(req);
        let query = createQuery(req);
        let limit = utils.safeParseInt(req.query.limit) < 0 ? 25 : utils.safeParseInt(req.query.limit);
        let skip = utils.safeParseInt(req.query.skip) < 0 ? 0 : utils.safeParseInt(req.query.skip);
        
        Animation.find(query, { frames: 0 }).sort(sort).limit(limit).skip(skip).exec((err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
    else {
        next();
    }
}

export function remove(req: express.Request, res: express.Response, next: express.NextFunction) {
    Animation.findByIdAndUpdate(req.params._id, { removed: true }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        return res.sendStatus(200);
    });
}

export function incrementViewCount(req: express.Request, res: express.Response, next: express.NextFunction) {
    Animation.findByIdAndUpdate(req.params._id, {$inc: { views: 1 } }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        return res.sendStatus(200);
    });
}

export function submitRating(req: express.Request, res: express.Response, next: express.NextFunction) {
    let rating = parseInt(req.params.rating);
    if (!rating) return next(400);
    if (rating <= 0 && rating >= 5) return next(400);

    Animation.findById(req.params._id, { frames: 0 }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        
        anim.rating = (anim.rating + rating) / 2;
        anim.save((err, result: Grafika.IAnimation) => {
            if (err) return next(err);
            res.send(201, result.rating);
        });
    });
}

export function getRandomAnimation(req: express.Request, res: express.Response, next: express.NextFunction) {
    let criteria = { removed: false, isPublic: true, $where: "this.totalFrame > 5" };
    Animation.find(criteria).lean().count((err, count) => {
        if (err) return next(err);

        let random = Math.floor(Math.random() * count);
        Animation.findOne(criteria).skip(random).lean().exec((err, result) => {
            if (err) return next(err);
            res.send(result); 
        });
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function postComment(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    Animation.findById(req.params._id, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);

        User.findById(anim.userId, (err, user) => {
            if (user.subscriptions.emailAnimationComment) {
                sendAnimationCommentEmail(anim, user, req.body)
                    .then(() => res.sendStatus(201))
                    .catch((err) => next(err));
            }
        });
    });
}

export function commentForMobile(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    let disqusToken = (req.user) ? generateDisqusToken(req.user) : { public: "", token: "" };
    let jwtToken = (req.user) ? generateJwtToken(req.user) : "";

    Animation.findById(req.params._id, { frames: 0 }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        
        let postUrl = `${config.setting.$server.$url}animations/${anim._id}/comments`;
        let queryString = `url=${config.setting.$content.$url}animations/${anim._id}&title=${anim.name}&shortname=grafika-app&identifier=${anim._id}&pub=${disqusToken.public}&disqusToken=${disqusToken.token}&postUrl=${postUrl}&jwtToken=${jwtToken}`;
        let url = `${config.setting.$content.$url}app/content/comment.html?${queryString}`;
        return res.redirect(url);
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function seo(req: express.Request, res: express.Response, next: express.NextFunction) {
    let animationId: string = req.params._id;
    let isCrawler = /bot|facebookexternalhit[0-9]|Twitterbot|Pinterest|Google.*snippet/i.test(req.header("user-agent"));

    if (!isCrawler)
        res.redirect(config.setting.$content.$url + animationId);
    else if (isCrawler) {
        Animation.findById(animationId, (err, anim) => {
            fs.readFile(path.resolve('server/templates/animation-seo.html'), 'utf-8', (err, data) => {
                if (err) return next(err);
                data = data.replace('{{url}}', `${config.setting.$content.$url}animations/${anim._id}`);
                data = data.replace('{{title}}', `${anim.name}`);
                data = data.replace('{{description}}', `${anim.description}`);
                data = data.replace('{{image}}', `${config.setting.$server.$url}animations/${anim.id}/thumbnail`);
                res.contentType('text/html').send(data);
            });
        });
    } 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createQuery(req): any {
    let qObject: any = { isPublic: true };
    if (req.query.term) {
        qObject.$text = { $search: req.query.term };
    }
    
    if (req.query.isPublic) {
        if (req.query.isPublic == "true")
            qObject.isPublic = true;
        if (req.query.isPublic == "false")
            qObject.isPublic = false;
    }

    //qObject.userId = req.query.userId;

    return qObject;
}

function createSort(req): any{
	let sort:any = {};
	if (req.query.sort === 'rating') 
		sort.rating = -1;
	else if (req.query.sort === 'views')
		sort.views = -1;
	else if (req.query.sort === 'newest')
		sort.dateModified = -1;
	sort._id = -1;
	return sort;
}