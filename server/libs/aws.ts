import * as $q from 'q';
import { IAnimation } from '../models/animation';
import { IUser } from '../models/user';
import * as aws from 'aws-sdk';
import * as config from '../configs/config';

////////////////////////////////////////////////////////////////////////////////

interface S3Extensions extends aws.S3 {
	listObjects(params: any, callback: (err: Error, data: any) => void): void;
	deleteObjects(params: any, callback: (err: Error, data: any) => void): void;
}

class AwsHelper {
	create(): S3Extensions {
		return <S3Extensions> new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
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
		let s3 = new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
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
	createSignedUrl(resource: Grafika.IResource): $q.Promise<Grafika.ISignedUrl>{
		let deferred = $q.defer<Grafika.ISignedUrl>();
		
		// get signedurl from s3
		let s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: `${config.setting.$auth.$awsFolder}/animations/${resource.animationId}/${resource._id}`,
			Expires: 600,
			ContentMD5: '',
			ContentType: resource.mime,
			ACL: 'public-read'
		};
		this.create().getSignedUrl('putObject', s3_params, (err, data) => {
			if (err) deferred.reject(err);
			else deferred.resolve({ signedUrl: data, mime: resource.mime });
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