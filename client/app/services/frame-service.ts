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

		get(animation: Grafika.IAnimation): ng.IPromise<any> {
			return this.apiService.get('animations/' + animation._id + '/frames');
		}
		update(animation: Grafika.IAnimation, data?: any) {
			return this.apiService.post('animations/' + animation._id + '/frames', data);
		}
    }
}