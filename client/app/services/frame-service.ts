module GrafikaApp {
    export class FrameService extends BaseService{
        public static $inject = ['appCommon', 'authService', 'apiService'];
        constructor (appCommon: AppCommon,
            private authService: AuthService,
            private apiService: ApiService){
            super(appCommon);
        }

		get(animation: Grafika.IAnimation): ng.IHttpPromise<Grafika.IFrame[]> {
			return this.apiService.get<Grafika.IFrame[]>('animations/' + animation._id + '/frames');
		}
		update(animation: Grafika.IAnimation, data: Grafika.IFrame[]): ng.IHttpPromise<Grafika.IFrame> {
			return this.apiService.post('animations/' + animation._id + '/frames', data);
		}
    }
}