module GrafikaApp {
    export module Drawing {
        export module Services {
            export class ApiService extends BaseService {
                public static $inject = ['appCommon', '$http'];
                constructor(appCommon: GrafikaApp.Drawing.AppCommon,
                    public $http: ng.IHttpService) {
                    super(appCommon);
                }

                get<TData>(path: string): ng.IHttpPromise<TData> {
                    return this.$http.get(this.url(path))
                        .catch(reason => this.log(reason));
                }

                post(path: string, data?: any): ng.IHttpPromise<any> {
                    return this.$http.post(this.url(path), data)
                        .catch(reason => this.log(reason));
                }

                put<TData>(path: string, data?: any | TData): ng.IHttpPromise<TData> {
                    return this.$http.put(this.url(path), data)
                        .catch(reason => this.log(reason));
                }

                delete(path: string): ng.IHttpPromise<any> {
                    return this.$http.delete(this.url(path))
                        .catch(reason => this.log(reason));
                }

                url(path): string {
                    return this.appCommon.appConfig.baseApiUrl + "/" + path;
                }

                log(reason): ng.IHttpPromise<any> {
                    let status = reason.status;
                    let config = reason.config;
                    if (status == 401 || status == 403 || status == 0) {
                        this.appCommon.hideLoadingModal();
                        //this.appCommon.navigate('/');
                    }
                    this.appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');

                    return this.appCommon.$q.reject();
                }
            }
        }
    }
}