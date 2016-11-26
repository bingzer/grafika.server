import * as express from 'express';
import * as mongoose from 'mongoose';

import { AwsResources } from '../libs/aws';
import { Resource, Thumbnail } from '../models/resource';

const aws = new AwsResources();

export function get(req : express.Request, res : express.Response, next: express.NextFunction) {
    let animId = req.params.animationId;
    let resourceId = req.params._id;
	res.redirect(aws.getResourceUrl(animId, resourceId));
}

export function del(req : express.Request, res : express.Response, next: express.NextFunction){
    let animId = req.params.animationId;
    let resourceId = req.params._id;
    aws.deleteResource(animId, resourceId).then((ret) => {
        res.sendStatus(200);
    });
}

export function createSignedUrl(req : express.Request, res : express.Response, next: express.NextFunction){
    let resource = new Resource({ _id: req.body._id });
    return aws.createSignedUrl(req.params.animationId, req.body.mime, resource).then((signedUrl) => {
        res.send(signedUrl);
    }).catch(next);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function getThumbnail(req : express.Request, res : express.Response, next: express.NextFunction){
    let animId = req.params.animationId;
	res.redirect(aws.getResourceUrl(animId, "thumbnail"));
}

export function createThumbnailSignedUrl(req : express.Request, res : express.Response, next: express.NextFunction) {
    let thumbnail = new Thumbnail(req.params.animationId);
    aws.createSignedUrl(thumbnail.animationId, thumbnail.mime, thumbnail).then((signedUrl) => {
        res.send(signedUrl);
    }).catch(next);
};