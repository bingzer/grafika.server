var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var AuthService = (function (_super) {
        __extends(AuthService, _super);
        function AuthService(appCommon, $rootScope, apiService, jwtHelper) {
            var _this = _super.call(this, appCommon) || this;
            _this.$rootScope = $rootScope;
            _this.apiService = apiService;
            _this.jwtHelper = jwtHelper;
            return _this;
        }
        AuthService.prototype.register = function (user) {
            return this.apiService.post('accounts/register', user);
        };
        AuthService.prototype.login = function (user, provider) {
            var _this = this;
            if (!provider)
                return this.apiService.post('accounts', user).then(function (token) {
                    _this.setAccessToken(token.data.token);
                    _this.authenticate(true);
                });
            else {
                window.location.href = this.appCommon.appConfig.apiBaseUrl + 'accounts/' + provider.toLowerCase();
                return this.appCommon.$q.when(true);
            }
        };
        AuthService.prototype.setAccessToken = function (token) {
            if (!token)
                return this.appCommon.$q.when(false);
            this.user = null;
            this.appCommon.$cookies.put('token', token);
            this.user = this.getUser();
            return this.appCommon.$q.when(true);
        };
        AuthService.prototype.getAccessToken = function () {
            return this.appCommon.$cookies.get('token');
        };
        AuthService.prototype.logout = function () {
            var _this = this;
            return this.apiService.post('accounts/logout').finally(function () {
                _this.clearToken();
                _this.appCommon.hideLoadingModal();
                _this.appCommon.navigateHome();
                return _this.appCommon.$q.when(true);
            });
        };
        AuthService.prototype.clearToken = function () {
            this.appCommon.$cookies.remove('token');
        };
        AuthService.prototype.authenticate = function (skipLogout) {
            var _this = this;
            var deferred = this.appCommon.$q.defer();
            this.apiService.post('accounts/authenticate')
                .then(function (res) {
                _this.setAccessToken(res.data.token);
                deferred.resolve();
            })
                .catch(function () {
                deferred.reject();
                if (!skipLogout)
                    _this.logout();
            });
            return deferred.promise;
        };
        AuthService.prototype.isAuthenticated = function () {
            return this.getAccessToken() != null;
        };
        AuthService.prototype.isAuthorized = function (roles) {
            if (!this.isAuthenticated())
                return false;
            var explicit = angular.isDefined(roles);
            var user = this.getUser();
            if (!explicit) {
                return user.hasRoles('user');
                // let route = this.appCommon.getCurrentRoute();
                // if (route) 
                //     roles = route.config.roles; 
            }
            else {
                return user.hasRoles(roles);
            }
        };
        AuthService.prototype.changePassword = function (pwd) {
            return this.apiService.post('accounts/pwd', pwd);
        };
        AuthService.prototype.resetPassword = function (user) {
            return this.apiService.post('accounts/pwd/reset', user);
        };
        AuthService.prototype.getDisqusToken = function () {
            return this.apiService.get('accounts/disqus');
        };
        AuthService.prototype.getUser = function () {
            if (!this.getAccessToken()) {
                this.user = null;
                return this.user;
            }
            if (this.user)
                return this.user;
            var payload = this.jwtHelper.decodeToken(this.getAccessToken());
            var user = new GrafikaApp.User(payload);
            return user;
        };
        return AuthService;
    }(GrafikaApp.BaseService));
    AuthService.$inject = ['appCommon', '$rootScope', 'apiService', 'jwtHelper'];
    GrafikaApp.AuthService = AuthService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/services/auth-service.js.map