import * as $q from 'q';
import { IResource } from '../models/resource';
import { IAnimation } from '../models/animation';
import { IUser } from '../models/user';
import * as aws from 'aws-sdk';
import * as config from '../configs/config';

////////////////////////////////////////////////////////////////////////////////

export class AwsUsers extends AwsHelper {

	/**
	 * Creates signed url
	 */
	createSignedUrl(user: IUser, imageType?: string, mime?: string) : $q.IPromise<ISignedUrl> {
		var deferred = $q.defer();
		if (!imageType) imageType = 'avatar';
		if (!mime) mime = 'image/png';
		
		// get signedurl from s3
		var s3 = new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
		var s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: 'grafika/users/' + user._id + '/' + imageType,
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
		var deferred = $q.defer();	
		if (!imageType) imageType = 'avatar';
		
		this.create().deleteObject({
				Bucket: config.setting.$auth.$awsBucket,
				Key: 'grafika/users/' + user._id + '/' + imageType
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
	createSignedUrl(resource: IResource): ng.IPromise<ISignedUrl>{
		var deferred = $q.defer();
		
		// get signedurl from s3
		var s3_params = {
			Bucket: config.setting.$auth.$awsBucket,
			Key: 'grafika/animations/' + resource.animationId + '/' + resource._id,
			Expires: 600,
			ContentMD5: '',
			ContentType: resource.mime,
			ACL: 'public-read'
		};
		this.create().getSignedUrl('putObject', s3_params, function(err, data){
			if (err) deferred.reject(err);
			else deferred.resolve({ signedUrl: data, mime: resource.mime });
		});
		return deferred.promise;
	}
	
	/** Returns the resource url */
	getResourceUrl (animId, id): string{
		return config.setting.$auth.$awsUrl + config.setting.$auth.$awsBucket + '/grafika/resources/' + animId + "/" + id;
	}
	
	/** Delete resource */
	deleteResource (animId: string, resourceId: string) : $q.IPromise<any> {
		var deferred = $q.defer();
		this.create().deleteObject({
				Bucket: config.setting.$auth.$awsBucket,
				Key: 'grafika/resources/' + animId + '/' + resourceId
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
		var deferred = $q.defer();	
		
		var params = {
			Bucket: config.setting.$auth.$awsBucket,
			Prefix: 'grafika/resources/' + animId
		};
		this.create().listObjects(params, (err, data) => {
			if (err) return deferred.reject(err);			
			var params = { 
				Bucket: config.setting.$auth.$awsBucket,
				Delete: {
					Objects: []
				}
			};
			
			params.Delete.Objects.push({ Key: 'resources/' + animId });
			data.Contents.forEach(function(content) {
				params.Delete.Objects.push({Key: content.Key});
			});
			
			this.create().deleteObjects(params, function(err, data) {
				if (err) return deferred.reject(err);			
				return deferred.resolve(data);
			});
		});
		return deferred.promise;
	}
}

class AwsHelper {
	create(): S3Extensions {
		return <S3Extensions> new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
	}
}

interface S3Extensions extends aws.S3 {
	listObjects(params: any, callback: (err: Error, data: any) => void): void;
	deleteObjects(params: any, callback: (err: Error, data: any) => void): void;
}

interface ISignedUrl {
	signedUrl: string;
	mime: string;	
}