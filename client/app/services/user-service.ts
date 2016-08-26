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
		upload(data: Grafika.ISignedUrl, blob: Blob): ng.IHttpPromise<any>{
            if (!data.mime || !data.signedUrl)
                throw new Error('Expecting data.mime && data.signedUrl');
			let req = {
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
        saveAvatar(user: Grafika.IUser, mime: string): ng.IHttpPromise<Grafika.ISignedUrl> { 
            return this.apiService.post('users/' + user._id + '/avatar', { imageType: 'avatar', mime: mime });
        }
        checkAvailability(email: string, username: string): ng.IHttpPromise<any> {
            return this.apiService.post("accounts/username-check", { email: email, username: username });
        }
    }
}