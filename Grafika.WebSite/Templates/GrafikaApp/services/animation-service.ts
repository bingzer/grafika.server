module GrafikaApp {
    export class AnimationService extends BaseService {
		
        public static $inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
        constructor (
			appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService,
			private resourceService: ResourceService
		){
			super(appCommon);
        }
        
		create(anim: Grafika.IAnimation): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.post('animations', anim);
		}
		list(paging?: Paging): ng.IHttpPromise<Grafika.IAnimation[]> {
			if (!paging) paging = new Paging();
			return this.apiService.get<[Grafika.IAnimation]>('animations' + paging.toQueryString())
                .then((res) => <ng.IHttpPromise<Grafika.IAnimation[]>> this.injectResources(res));
		}
		get(_id: string): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.get<Grafika.IAnimation>('animations/' + _id)
                .then((res) => <ng.IHttpPromise<Grafika.IAnimation>> this.injectResources(res));
		}
		getRandom(): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.get<Grafika.IAnimation>('animations/random')
                .then((res) => <ng.IHttpPromise<Grafika.IAnimation>> this.injectResources(res));
		}
		getRelated(_id: string, count: Number =  5): ng.IHttpPromise<Grafika.IAnimation[]> {
			return this.apiService.get<Grafika.IAnimation[]>('animations/' + _id + '/related?count=' + count)
                .then((res) => <ng.IHttpPromise<Grafika.IAnimation[]>> this.injectResources(res));
		}
		delete(_id: string): ng.IHttpPromise<any> {
			return this.apiService.delete('animations/' + _id);
		}
		update(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.put('animations/' + anim._id, anim);
		}

		postNewComment(anim: Grafika.IAnimation, comment: { id: string, text: string }): ng.IHttpPromise<any> {
			return this.apiService.post('animations/' + anim._id + '/comments', comment);
		}
		incrementViewCount(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.post('animations/' + anim._id + '/view');
		}
		rate(animationId: string, rating: number): ng.IHttpPromise<number> {
			return this.apiService.post('animations/' + animationId + '/rating/' + rating);
		}
		getDownloadLink(anim: Grafika.IAnimation): string {
			return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
		}

		injectResources(res: ng.IHttpPromiseCallbackArg<Grafika.IAnimation | Grafika.IAnimation[]>): ng.IHttpPromise<Grafika.IAnimation | Grafika.IAnimation[]> {
			if (angular.isArray(res.data)){
				let anims = <[Grafika.IAnimation]> res.data; 
				anims.forEach(anim => this.fixedResourceUrls(anim));
			}
			else {
				this.fixedResourceUrls(res.data);
            }

            return <ng.IHttpPromise<Grafika.IAnimation | Grafika.IAnimation[]>> this.appCommon.$q.when(res);
		}

		private fixedResourceUrls(anim: Grafika.IAnimation){
			if (anim.resources)
			{
				anim.resources.forEach(res => {
					let resource: any = res;
					if (resource.type == 'background-image' && (!resource.base64)){
						resource.url = this.appCommon.appConfig.apiBaseUrl + 'animations/' + anim._id + '/resources/' + resource.id;
					}
				});
			}
			anim.thumbnailUrl = this.resourceService.getThumbnailUrl(anim);
		}
    }
}