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

        listAnimations(paging: Paging): ng.IHttpPromise<Grafika.IAnimation[]> {
            return this.apiService.get<Grafika.IAnimation[]>('admin/animations' + paging.toQueryString());
        }

        listUsers(paging: Paging): ng.IHttpPromise<Grafika.IUser[]> {
            return this.apiService.get<Grafika.IUser[]>('admin/users' + paging.toQueryString());
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
    }
}