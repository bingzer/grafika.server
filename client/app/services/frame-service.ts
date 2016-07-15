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

		get(animation: Grafika.IAnimation): ng.IHttpPromise<[Grafika.IFrame]> {
			return this.apiService.get<[Grafika.IFrame]>('animations/' + animation._id + '/frames');
		}
		update(animation: Grafika.IAnimation, data: [Grafika.IFrame]): ng.IHttpPromise<Grafika.IFrame> {
			return this.apiService.post('animations/' + animation._id + '/frames', data);
		}
    }
}