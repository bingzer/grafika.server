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
        
		create(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.post('animations', anim);
		}
		list(paging?: Paging): ng.IHttpPromise<[Grafika.IAnimation]> {
			if (!paging) paging = new Paging();
			return this.apiService.get<[Grafika.IAnimation]>('animations' + paging.toQueryString()).then((res) => {
				res.data.forEach(anim => {
					anim.thumbnailUrl = this.resourceService.getThumbnailUrl(anim);
				});
				return this.appCommon.$q.when(res);
			});
		}
		get(_id): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.get<Grafika.IAnimation>('animations/' + _id).then((res) => {
				res.data.thumbnailUrl = this.resourceService.getThumbnailUrl(res.data);
				return this.appCommon.$q.when(res);
			});
		}
		delete(_id): ng.IHttpPromise<any> {
			return this.apiService.delete('animations/' + _id);
		}
		update(anim: Grafika.IAnimation): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.put<Grafika.IAnimation>('animations/' + anim._id, anim).then((res) => {
				res.data.thumbnailUrl = this.resourceService.getThumbnailUrl(res.data);
				return this.appCommon.$q.when(res);
			});
		}
		incrementViewCount(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.post('animations/' + anim._id + '/view');
		}
		getDownloadLink(anim: Grafika.IAnimation): string {
			return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
		}
    }
}