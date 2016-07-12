(function (angular) {
    var app = angular.module('app');

	app.factory('animationService', ['appCommon', 'authService', 'apiService', function (appCommon, authService, apiService) {
		function create(anim) {
			return apiService.post('animations', anim);
		}
		function list(paging) {
			if (!paging) paging = createPaging();
			var query = createPagingQuery(paging);
			return apiService.get('animations' + query).then(injectThumbnailUrl);
		}
		function get(_id) {
			return apiService.get('animations/' + _id).then(injectThumbnailUrl);
		}
		function del(_id) {
			return apiService.delete('animations/' + _id);
		}
		function update(anim) {
			return apiService.put('animations/' + anim._id, anim).then(injectThumbnailUrl);
		}
		function incrementViewCount(anim) {
			return apiService.post('animations/' + anim._id + '/view');
		}
		function getDownloadLink(anim){
			return apiService.baseUrl + 'animations/' + anim._id + '/download?token=' + authService.getAccessToken();
		}

		return {
			list: list,
			
			create: create,
			get: get,
			del: del,
			update: update,
			getDownloadLink: getDownloadLink,
			
			createPaging: createPaging,
			createPagingQuery: createPagingQuery,
			
			incrementViewCount: incrementViewCount,
			injectThumbnailUrl: injectThumbnailUrl
		};
		
		function injectThumbnailUrl(res){
			if (res && res.data){
				if (res.data.length > 0) res.data.forEach(injectThumanilUrlToAnim);
				else injectThumanilUrlToAnim(res.data);
			}
			return appCommon.$q.when(res);
		}
		
		function injectThumanilUrlToAnim(anim){
			//anim.thumbnailUrl = resourceService.getThumbnailUrl(anim, true);
		}
		
		function createPaging(public){
			return {   
				isPublic: public || true,
				page: 0, 
				count: appCommon.appConfig.fetchSize
			};
		}
		
		function createPagingQuery(paging){			
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
		
	}]);
})(window.angular);