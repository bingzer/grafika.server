module GrafikaApp {
    export class UserService extends BaseService {
        public static $inject = ['appCommon', 'authService', 'apiService'];
        constructor (
            appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService) {
			super(appCommon);
        }        

		list(paging: Paging): ng.IHttpPromise<any> {
			return this.apiService.get('users');
		}
        get(_id: string): ng.IHttpPromise<Grafika.IUser> {
            return this.apiService.get('users/' + _id);
        }
        update(user: Grafika.IUser): ng.IHttpPromise<any> {
            return this.apiService.put('users/' + user._id, user);
        }

        checkAvailability(email: string, username: string): ng.IHttpPromise<any> {
            return this.apiService.post("accounts/username-check", { email: email, username: username });
        }
    }
}