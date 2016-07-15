module GrafikaApp {
    export class AnimationService {
		public static $inject = [
			'appCommon',
            'authService',
            'apiService'
		];

        constructor (
            public appCommon: AppCommon,
            public authService: AuthService,
            public apiService: ApiService
        ){
            // nothing
        }
        
		create(anim: Grafika.IAnimation) {
			return this.apiService.post('animations', anim);
		}
		list(paging?: Paging): ng.IHttpPromise<[Grafika.IAnimation]> {
			if (!paging) paging = new Paging();
			return this.apiService.get<[Grafika.IAnimation]>('animations' + paging.toQueryString()).then((res) => {
				return this.injectThumbnailUrl(res);
			});
		}
		get(_id): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.get<Grafika.IAnimation>('animations/' + _id).then((res) => {
				return this.injectThumbnailUrl(res)
			});
		}
		del(_id): ng.IHttpPromise<any> {
			return this.apiService.delete('animations/' + _id);
		}
		update(anim: Grafika.IAnimation): ng.IHttpPromise<Grafika.IAnimation> {
			return this.apiService.put<Grafika.IAnimation>('animations/' + anim._id, anim).then((res) => {
				return this.injectThumbnailUrl(res)
			});
		}
		incrementViewCount(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
			return this.apiService.post('animations/' + anim._id + '/view');
		}
		getDownloadLink(anim: Grafika.IAnimation): string {
			return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
		}
        
		injectThumbnailUrl(res: any){
			return this.appCommon.$q.when(res);
			// if (res && res.data){
			// 	// inject thumbnail to anim
			// }
			// return () => this.appCommon.$q.when(res);
		}
		
		private createPagingQuery(paging){			
			var query = '?';
			if (paging){
				if (paging.userId) query+= '&userId=' + paging.userId;
				else query += '&isPublic=true';

				if (paging.category) query += '&category=' + paging.category;
				if (paging.sort) query += '&sort=' + paging.sort;
				if (paging.count) query += '&limit=' + paging.count;
				if (paging.page) query += '&skip=' + paging.page;
				if (paging.query) query += "&query=" + paging.query;
				if (paging.type) query += "&type=" + paging.type;
			}
			return query;
		}
    }
}