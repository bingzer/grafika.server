module GrafikaApp {
    export class AdminService extends BaseService{
        public static $inject = ['appCommon', 'authService', 'apiService'];
        constructor (appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService){
            super(appCommon);
        }

        getServerInfo(): ng.IHttpPromise<any>{
            return this.apiService.get('admin');
        }

        listUsers(paging: Paging): ng.IHttpPromise<Grafika.IUser[]> {
            return this.apiService.get<Grafika.IUser[]>('admin/users' + paging.toQueryString());
        }

        listAnimations(paging: Paging): ng.IHttpPromise<Grafika.IAnimation[]> {
            return this.apiService.get<Grafika.IAnimation[]>('admin/animations' + paging.toQueryString());
        }

		sendVerificationEmail(user): ng.IHttpPromise<any> {
			return this.apiService.post('admin/users/' + user._id + '/reverify');
		}

		sendResetPasswordEmail(user): ng.IHttpPromise<any> {
			return this.apiService.post('admin/users/' + user._id + '/reset-pwd');
		}

		inactivateUser(user): ng.IHttpPromise<any> {
			return this.apiService.post('admin/users/' + user._id + '/inactivate');
		}

		activateUser(user): ng.IHttpPromise<any> {
			return this.apiService.post('admin/users/' + user._id + '/activate');
		}

        /*
        function getServerInfo() {
			return apiService.get('admin');
		}
		function listUsers(paging){
			return apiService.get('admin/users' + createPagingQuery(paging));
		}
		function listAnimations(paging){
			return apiService.get('admin/animations' + createPagingQuery(paging)).then(animationService.injectThumbnailUrl);
		}
		function getUxPage() {
			return {
				onClose: appCommon.navigateHome,
				links: [
					{ title: 'Administrations', click: function(){ appCommon.navigate('/admin') } },
					{ title: 'Animations', click: function(){ appCommon.navigate('/admin/animations') } },
					{ title: 'Users', click: function(){ appCommon.navigate('/admin/users') } }
				]
			};
		}
		function sendVerificationEmail(user){
			return apiService.post('admin/users/' + user._id + '/reverify');
		}
		function sendResetPasswordEmail(user){
			return apiService.post('admin/users/' + user._id + '/reset-pwd');
		}
		function inactivateUser(user){
			return apiService.post('admin/users/' + user._id + '/inactivate');
		}
		function activateUser(user){
			return apiService.post('admin/users/' + user._id + '/activate');
		}

		return {
			getServerInfo: getServerInfo,
			listUsers: listUsers,
			listAnimations: listAnimations,
			
			sendVerificationEmail: sendVerificationEmail,
			sendResetPasswordEmail: sendResetPasswordEmail,
			activateUser: activateUser,
			inactivateUser: inactivateUser,
			
			getUxPage: getUxPage
		};
		
		function createPagingQuery(paging){			
			var query = '';
			if (paging){
				query += '?paging=1';
				if (paging.sort) query += '&sort=' + paging.sort;
				if (paging.count) query += '&count=' + paging.count;
				if (paging.page) query += '&page=' + paging.page;
				if (paging.query) query += "&query=" + paging.query;
			}
			return query;
		}
        */
    }
}