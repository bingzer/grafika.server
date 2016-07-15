module GrafikaApp {
    export class ResourceService {
		public static $inject = [
			'appCommon',
            'authService',
            'apiService'
		];

        constructor (
            private appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService
        ){
            // nothing
        }        
        
		list(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.get('animations/' + anim._id + '/resources/');
		}
		get(anim: Grafika.IAnimation, resourceId: string): ng.IHttpPromise<Grafika.IResource> {
			return this.apiService.get('animations/' + anim._id + '/resources/' + resourceId);
		}
		del(anim: Grafika.IAnimation, resourceId: string): ng.IHttpPromise<any> {
			return this.apiService.delete('animations/' + anim._id + '/resources/' + resourceId);
		}
		create(anim: Grafika.IAnimation, resource: Grafika.IResource): ng.IHttpPromise<any> {
			return this.apiService.post('animations/' + anim._id + '/resources/', resource);
		}
		upload(data: Grafika.ISignedUrl, blob: Blob): ng.IHttpPromise<any>{
            if (!data.mime || !data.signedUrl)
                throw new Error('Expecting data.mime && data.signedUrl');
			var req = {
				method: 'PUT',
				url: data.signedUrl,
				cors: true,
				headers: {
					'Authorization': undefined,
					'Content-Type': data.mime,  // must match with nodejs getSignUrl
					'x-amz-acl': 'public-read',
				},
				data: blob
			};
			return this.apiService.$http(req);
		}
		getResourceUrl(anim: Grafika.IAnimation, resource: Grafika.IResource | string): string {
			var resourceId = resource;
            if (resource instanceof Grafika.IResource)
                resourceId = (<Grafika.IResource> resource)._id;

			return this.appCommon.appConfig.animationBaseUrl + anim._id + '/' + resourceId;
		}
		getThumbnailUrl(anim: Grafika.IAnimation): string{
			return this.appCommon.appConfig.apiBaseUrl + 'animations/' + anim._id + '/thumbnail';
		}
		saveThumbnail(anim: Grafika.IAnimation): ng.IHttpPromise<Grafika.ISignedUrl>{
			return this.apiService.post('animations/' + anim._id + '/thumbnail');
		}


    }
}