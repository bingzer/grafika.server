
module grafikaApp {
    export class ApiService {
		public static $inject = [
			'$http',
			'appCommon'
		];

        constructor (
            private $http: ng.IHttpService,
            private appCommon: AppCommon 
        ){
            // nothing
        }

        get(path: string): ng.IHttpPromise<any> {
            return this.$http.get(this.url(path)).error(this.log);
        }

        post(path: string, data?: any): ng.IHttpPromise<any> {
            return this.$http.post(this.url(path), data).error(this.log);
        }

        put(path: string, data?: any): ng.IHttpPromise<any> {
            return this.$http.put(this.url(path), data).error(this.log);
        }

        delete(path: string): ng.IHttpPromise<any> {
            return this.$http.delete(this.url(path)).error(this.log);
        }

        url(path) : string {
            return this.appCommon.appConfig.apiBaseUrl + path;
        }

        log(data, status, headers, config): ng.IHttpPromise<any> {
            var deferred = this.appCommon.$q.defer();
            if (status == 401 || status == 403 || status == 0) {
                //authService.clearToken();
                this.appCommon.navigate('/');
            } else {
                this.appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');
            }
            deferred.resolve();
            return deferred.promise;
        }
    }
}