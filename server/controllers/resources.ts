import * as express from 'express';
import * as mongoose from 'mongoose';

import { AwsUsers, AwsResources } from '../libs/aws';
import { Resource } from '../models/resource';

const aws = new AwsResources();

export function get(req : express.Request, res : express.Response, next: express.NextFunction) {
    var animId = req.params.animationId;
    var resourceId = req.params._id;
	res.redirect(aws.getResourceUrl(animId, resourceId));
}

export function del(req : express.Request, res : express.Response, next: express.NextFunction){
    var animId = req.params.animationId;
    var resourceId = req.params._id;
    aws.deleteResource(animId, resourceId).then((ret) => {
        res.sendStatus(200);
    });
}

export function createSignedUrl(req : express.Request, res : express.Response, next: express.NextFunction){
    var animId = new mongoose.Types.ObjectId(req.params.animationId);
    var resource = new Resource({ _id: req.body._id, mime: req.body.mime, animationId: animId });
    return aws.createSignedUrl(resource).then((signedUrl) => {
        res.send(signedUrl);
    }).catch(next);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function getThumbnail(req : express.Request, res : express.Response, next: express.NextFunction){
    var animId = req.params.animationId;
	res.redirect(aws.getResourceUrl(animId, "thumbnail"));
}

export function createThumbnailSignedUrl(req : express.Request, res : express.Response, next: express.NextFunction) {
    var animId = new mongoose.Types.ObjectId(req.params.animationId);
    var resource = new Resource({ _id: 'thumbnail', mime: 'image/png', animationId: animId });
    return aws.createSignedUrl(resource).then((signedUrl) => {
        res.send(signedUrl);
    }).catch(next);
};