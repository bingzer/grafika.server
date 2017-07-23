module GrafikaApp {
    export module Drawing {
        export module Services {
            export class AuthService extends BaseService{
                private user: GrafikaApp.Drawing.Models.User;

                public static $inject = ['appCommon', '$rootScope', 'apiService', 'jwtHelper'];
                constructor(
                    appCommon: AppCommon,
                    private $rootScope: ng.IRootScopeService,
                    private apiService: ApiService,
                    private jwtHelper: ng.jwt.IJwtHelper
                ) {
                    super(appCommon);
                }

                register(user: any): ng.IPromise<any> {
                    return this.apiService.post('accounts/register', user);
                }

                login(user: any, provider: string): ng.IPromise<any> {
                    if (!provider)
                        return this.apiService.post('accounts', user).then((token) => {
                            this.setAccessToken(token.data.token);
                            this.authenticate(true)
                        });
                    else {
                        window.location.href = this.appCommon.appConfig.baseApiUrl + 'accounts/' + provider.toLowerCase();
                        return this.appCommon.$q.when(true);
                    }
                }

                setAccessToken(token: string) {
                    if (!token) return this.appCommon.$q.when(false);
                    this.user = null;
                    this.appCommon.$cookies.put('token', token);
                    this.user = this.getUser();
                    return this.appCommon.$q.when(true);
                }

                getAccessToken(): string {
                    return this.appCommon.$cookies.get('token');
                }

                logout(): ng.IPromise<any> {
                    return this.apiService.post('accounts/logout').finally(() => {
                        this.clearToken();
                        this.appCommon.hideLoadingModal();
                        this.appCommon.navigateHome();
                        return this.appCommon.$q.when(true);
                    });
                }

                clearToken() {
                    this.appCommon.$cookies.remove('token');
                }

                authenticate(skipLogout?: boolean): ng.IPromise<any> {
                    let deferred = this.appCommon.$q.defer();
                    this.apiService.post('accounts/authenticate')
                        .then((res) => {
                            this.setAccessToken(res.data.token);
                            deferred.resolve();
                        })
                        .catch(() => {
                            deferred.reject();
                            if (!skipLogout) this.logout();
                        });
                    return deferred.promise;
                }

                isAuthenticated(): boolean {
                    return this.getAccessToken() != null;
                }

                isAuthorized(roles: string | [string]) {
                    if (!this.isAuthenticated())
                        return false;
                    let explicit = angular.isDefined(roles);
                    let user = this.getUser();
                    if (!explicit) {
                        return user.hasRoles('user');
                        // let route = this.appCommon.getCurrentRoute();
                        // if (route) 
                        //     roles = route.config.roles; 
                    }
                    else {
                        return user.hasRoles(roles);
                    }
                }

                changePassword(pwd): ng.IPromise<any> {
                    return this.apiService.post('accounts/pwd', pwd);
                }

                resetPassword(user): ng.IPromise<any> {
                    return this.apiService.post('accounts/pwd/reset', user);
                }

                getDisqusToken(): ng.IPromise<any> {
                    return this.apiService.get('accounts/disqus');
                }

                getUser(): Models.User {
                    if (!this.getAccessToken()) {
                        this.user = null;
                        return this.user;
                    }
                    if (this.user) return this.user;

                    let payload: any = this.jwtHelper.decodeToken(this.getAccessToken());
                    let user = new Models.User(payload);
                    return user;
                }
            }
        }
    }
}