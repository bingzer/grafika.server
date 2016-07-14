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
        
		create(anim: Animation) {
			return this.apiService.post('animations', anim);
		}
		list(paging?: any) {
			if (!paging) paging = this.createPaging();
			var query = this.createPagingQuery(paging);
			return this.apiService.get('animations' + query).then((res) => {
				return this.injectThumbnailUrl(res)
			});
		}
		get(_id) {
			return this.apiService.get('animations/' + _id).then((res) => {
				return this.injectThumbnailUrl(res)
			});
		}
		del(_id) {
			return this.apiService.delete('animations/' + _id);
		}
		update(anim: Animation) {
			return this.apiService.put('animations/' + anim._id, anim).then((res) => {
				return this.injectThumbnailUrl(res)
			});
		}
		incrementViewCount(anim) {
			return this.apiService.post('animations/' + anim._id + '/view');
		}
		getDownloadLink(anim){
			return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
		}
        
		injectThumbnailUrl(res: any){
			return this.appCommon.$q.when(res);
			// if (res && res.data){
			// 	// inject thumbnail to anim
			// }
			// return () => this.appCommon.$q.when(res);
		}
		
		createPaging(isPublic?: any): any{
			return {   
				isPublic: isPublic || true,
				page: 0, 
				count: this.appCommon.appConfig.fetchSize
			};
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