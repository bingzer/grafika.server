module GrafikaApp {
    export class FrameService {
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

		get(animation: Animation): ng.IPromise<any> {
			return this.apiService.get('animations/' + animation._id + '/frames');
		}
		update(animation: Animation, data?: any) {
			return this.apiService.post('animations/' + animation._id + '/frames', data);
		}
    }
}