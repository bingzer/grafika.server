
module GrafikaApp {
    export class ApiService extends BaseService{
        public static $inject = ['appCommon', '$http'];
        constructor (appCommon: AppCommon, public $http: ng.IHttpService){
            super(appCommon);
        }

        get<TData>(path: string): ng.IHttpPromise<TData> {
            return this.$http.get(this.url(path))
                .error((data, status, headers, config) => {
                    return this.log(data, status, headers, config)
                });
        }

        post(path: string, data?: any): ng.IHttpPromise<any> {
            return this.$http.post(this.url(path), data)
                .error((data, status, headers, config) => {
                    return this.log(data, status, headers, config)
                });
        }

        put<TData>(path: string, data?: any | TData): ng.IHttpPromise<TData> {
            return this.$http.put(this.url(path), data)
                .error((data, status, headers, config) => {
                    return this.log(data, status, headers, config)
                });
        }

        delete(path: string): ng.IHttpPromise<any> {
            return this.$http.delete(this.url(path))
                .error((data, status, headers, config) => {
                    return this.log(data, status, headers, config)
                });
        }

        url(path) : string {
            return this.appCommon.appConfig.apiBaseUrl + path;
        }

        log(data, status, headers, config): ng.IHttpPromise<any> {
            let deferred = this.appCommon.$q.defer();
            if (status == 401 || status == 403 || status == 0) {
                this.appCommon.hideLoadingModal();
                //this.appCommon.navigate('/');
            } 
            this.appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');
            
            deferred.resolve();
            return deferred.promise;
        }
    }
}