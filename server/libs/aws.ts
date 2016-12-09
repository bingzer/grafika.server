import * as $q from 'q';
import { IAnimation } from '../models/animation';
import { IUser } from '../models/user';
import * as aws from 'aws-sdk';
import * as express from 'express';
import * as request from 'request';
import * as config from '../configs/config';
import * as zlib from 'zlib';

////////////////////////////////////////////////////////////////////////////////

class AwsHelper {

	constructor() {
		aws.config.update({
			credentials: {
				accessKeyId: config.setting.$auth.$awsId,
				secretAccessKey: config.setting.$auth.$awsSecret
			} 
		});
	}

	create(): aws.S3 {
		return new aws.S3();
	}
}

export class AwsUsers extends AwsHelper {

	/**
	 * Creates signed url
	 */
	createSignedUrl(user: IUser, imageType?: string, mime?: string) : $q.Promise<Grafika.ISignedUrl> {
		let deferred = $q.defer<Grafika.ISignedUrl>();
		if (!imageType) imageType = 'avatar';
		if (!mime) mime = 'image/png';
		// get signedurl from s3
		let s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: `${config.setting.$auth.$awsFolder}/users/${user._id}/${imageType}`,
			Expires: 600,
			ContentMD5: '',
			ContentType: mime,
			ACL: 'public-read'
		};
		this.create().getSignedUrl('putObject', s3_params, (err, data) =>{
			if (err) deferred.reject(err);
			else deferred.resolve({ signedUrl: data, mime: mime });
		});
		return deferred.promise;
	}

	/** 
	 * Delete profile image (Avatar) 
	 * */
	deleteAvatar(user: IUser, imageType?: string) : $q.IPromise<any>{
		let deferred = $q.defer();	
		if (!imageType) imageType = 'avatar';
		
		this.create().deleteObject({
				Bucket: config.setting.$auth.$awsBucket,
				Key: `${config.setting.$auth.$awsFolder}/users/${user._id}/${imageType}`
			}, function (err, data){
				if (err) deferred.reject(err);
				else deferred.resolve(data);
			});
		return deferred.promise;
	}
}


export class AwsResources extends AwsHelper {

	/** 
	 * Create SignedUrl for resources 
	 * 
	 * */
	createSignedUrl(animationId: string, mime: string, resource: Grafika.IResource): $q.Promise<Grafika.ISignedUrl>{
		let deferred = $q.defer<Grafika.ISignedUrl>();
		
		// get signedurl from s3
		let s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: `${config.setting.$auth.$awsFolder}/animations/${animationId}/${resource.id}`,
			Expires: 600,
			ContentMD5: '',
			ContentType: mime,
			ACL: 'public-read'
		};
		this.create().getSignedUrl('putObject', s3_params, (err, data) => {
			if (err) deferred.reject(err);
			else deferred.resolve({ signedUrl: data, mime: mime });
		});
		return deferred.promise;
	}
	
	/** Returns the resource url */
	getResourceUrl (animId: string, resourceId: string): string{
		if (config.setting.$auth.$awsBucket === 'fake')
			return `${config.setting.$content.$url}assets/img/placeholder.png`;
		return `${config.setting.$auth.$awsUrl}${config.setting.$auth.$awsBucket}/${config.setting.$auth.$awsFolder}/animations/${animId}/${resourceId}`;
	}
	
	/** Delete resource */
	deleteResource (animId: string, resourceId: string) : $q.IPromise<any> {
		let deferred = $q.defer();
		this.create().deleteObject({
				Bucket: config.setting.$auth.$awsBucket,
				Key: `${config.setting.$auth.$awsFolder}/animations/${animId}/${resourceId}`
			}, function (err, data){
				if (err) deferred.reject(err);
				else deferred.resolve(data);
			});
		return deferred.promise;
	}
}

export class AwsAnimation extends AwsHelper {
	/**
	 * Delete animation and all resources under
	 */
	deleteAnimation (animId) : $q.IPromise<any> {
		let deferred = $q.defer();	
		
		let params = {
			Bucket: config.setting.$auth.$awsBucket,
			Prefix: `${config.setting.$auth.$awsFolder}/animations/${animId}`
		};
		this.create().listObjects(params, (err, data) => {
			if (err) return deferred.reject(err);			
			let params = { 
				Bucket: config.setting.$auth.$awsBucket,
				Delete: {
					Objects: []
				}
			};
			
			params.Delete.Objects.push({ Key: 'animations/' + animId });
			data.Contents.forEach((content) => {
				params.Delete.Objects.push({Key: content.Key});
			});
			
			this.create().deleteObjects(params, (err, data) => {
				if (err) return deferred.reject(err);			
				return deferred.resolve(data);
			});
		});
		return deferred.promise;
	}
}

export class AwsFrames extends AwsHelper {

	postFrames(animation: IAnimation | string, req: express.Request, res: express.Response, next: express.NextFunction) {
		this.generatePOSTUrl(animation, (err, signedUrl) => {
            zlib.deflate(Buffer.from(req.body), (err, result: Buffer) => {
                if (err) return next(err);
				let xreq = request.put(signedUrl.signedUrl, { body: result });
				xreq.setHeader("Content-Type", "application/json");
				xreq.setHeader("Content-Encoding", "deflate");
				xreq.pipe(res, { end: true });
            });
		});
	}

	getFrames(animation: IAnimation | string, req: express.Request, res: express.Response, next: express.NextFunction) {
		this.generateGETUrl(animation, (err, signedUrl) => {
			res.header('Content-Type', 'application/json');

			if (req.acceptsEncodings("deflate") && !req.header("X-inflate-frames")) {
				res.header('Content-Encoding', 'deflate');
				request(signedUrl.signedUrl).pipe(res);
			}
			else {
				request(signedUrl.signedUrl, { encoding: null }, (err, incoming, body) => {
					if (err) return next(err);
					zlib.inflate(body, (err, result) => {
						if (err) return next(err);
						res.send(result);
					});
				});
			}
		});
	}

	generatePOSTUrl(animation: IAnimation | string, callback: (err: Error, signedUrl: Grafika.ISignedUrl) => void) {
		let animationId = (<IAnimation>animation)._id ? (<IAnimation>animation)._id : animation;
		let s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: `${config.setting.$auth.$awsFolder}/animations/${animationId}/frames`,
			Expires: 600,
			ContentMD5: '',
			ContentType: 'application/json',
			ContentEncoding: 'deflate',
			ACL: 'authenticated-read'
		};

		this.create().getSignedUrl("putObject", s3_params, (err, url: string) => {
			callback(err, { signedUrl: url, mime: 'application/json' });
		});
	}

	/**
	 * Generate GET Url for the specified URL
	 */
	generateGETUrl(animation: IAnimation | string, callback: (err: Error, signedUrl: Grafika.ISignedUrl) => void) {
		let animationId = (<IAnimation>animation)._id ? (<IAnimation>animation)._id : animation; 
		let s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: `${config.setting.$auth.$awsFolder}/animations/${animationId}/frames`,
			Expires: 600
		};

		this.create().getSignedUrl("getObject", s3_params, (err, url: string) => {
			callback(err, { signedUrl: url, mime: 'application/json' });
		});
	}

}