module GrafikaApp {
    export class BackgroundService extends BaseService {
		
        public static $inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
        constructor (
			appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService,
			private resourceService: ResourceService
		){
			super(appCommon);
        }
        
		create(background: Grafika.IBackground): ng.IHttpPromise<Grafika.IBackground> {
			return this.apiService.post('background', background);
		}
		list(paging?: Paging): ng.IHttpPromise<Grafika.IBackground[]> {
			if (!paging) paging = new Paging();
			return this.apiService.get<[Grafika.IBackground]>('backgrounds' + paging.toQueryString())
                .then((res) => <ng.IHttpPromise<Grafika.IBackground[]>> this.injectResources(res));
		}
		get(_id: string): ng.IHttpPromise<Grafika.IBackground> {
			return this.apiService.get<Grafika.IBackground>('backgrounds/' + _id)
                .then((res) => <ng.IHttpPromise<Grafika.IBackground>> this.injectResources(res));
		}
		delete(_id: string): ng.IHttpPromise<any> {
			return this.apiService.delete('backgrounds/' + _id);
		}
		update(background: Grafika.IBackground): ng.IHttpPromise<any> {
			return this.apiService.put('backgrounds/' + background._id, background);
		}
		getFrames(background: Grafika.IBackground): ng.IHttpPromise<Grafika.IFrame[]> {
			return this.apiService.get<Grafika.IFrame[]>('backgrounds/' + background._id + '/frames');
		}
		updateFrames(background: Grafika.IBackground, data: Grafika.IFrame[]): ng.IHttpPromise<Grafika.IFrame> {
			return this.apiService.post('backgrounds/' + background._id + '/frames', data);
		}

		injectResources(res: ng.IHttpPromiseCallbackArg<Grafika.IBackground | Grafika.IBackground[]>): ng.IHttpPromise<Grafika.IBackground | Grafika.IBackground[]> {
			if (angular.isArray(res.data)){
				let backgrounds = <[Grafika.IBackground]> res.data; 
				backgrounds.forEach(background => this.fixedResourceUrls(background));
			}
			else {
				this.fixedResourceUrls(res.data);
            }
            return <ng.IHttpPromise<Grafika.IBackground | Grafika.IBackground[]>> this.appCommon.$q.when(res);
		}

		private fixedResourceUrls(background: Grafika.IBackground){
			background.thumbnailUrl = this.resourceService.getThumbnailUrl(background);
		}
    }
}