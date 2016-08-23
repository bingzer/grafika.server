import * as express from "express";
import * as q from 'q';

import * as config from '../configs/config';
import * as utils from '../libs/utils';

import { Animation, IAnimation } from "../models/animation";
import { AwsAnimation, AwsResources } from '../libs/aws';

export function search(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.query.term) {
        let sort = createSort(req);
        let query = createQuery(req);
        let limit = utils.safeParseInt(req.query.limit) < 0 ? 25 : utils.safeParseInt(req.query.limit);
        let skip = utils.safeParseInt(req.query.skip) < 0 ? 0 : utils.safeParseInt(req.query.skip);
        
        Animation.find(query).limit(limit).skip(skip).sort(sort).exec((err, result) => {
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
    Animation.findByIdAndUpdate(req.params._id, {$inc: { views: 1 }}, (err, anim) => {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createQuery(req){
    return { $text : { $search: req.query.term } };
}

function createSort(req){
	let sort:any = {};
	if (req.query.sort === 'rating') 
		sort.rating = -1;
	else if (req.query.sort === 'views')
		sort.views = -1;
	else if (req.query.sort === 'newest')
		sort.modifiedDate = -1;
	sort._id = -1;
	return sort;
}