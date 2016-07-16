var GrafikaApp;
(function (GrafikaApp) {
    var AuthService = (function () {
        function AuthService($rootScope, appCommon, apiService, jwtHelper) {
            this.$rootScope = $rootScope;
            this.appCommon = appCommon;
            this.apiService = apiService;
            this.jwtHelper = jwtHelper;
        }
        AuthService.prototype.register = function (user) {
            return this.apiService.post('accounts/register', user);
        };
        AuthService.prototype.login = function (user, provider) {
            var _this = this;
            if (!provider)
                return this.apiService.post('accounts', user).success(function () { return _this.authenticate(); });
            else {
                window.location.href = this.appCommon.appConfig.apiBaseUrl + 'accounts/' + provider.toLowerCase();
                return this.appCommon.$q.when(true);
            }
        };
        AuthService.prototype.setAccessToken = function (token) {
            if (!token)
                return this.appCommon.$q.when(false);
            this.user = null;
            this.appCommon.$window.sessionStorage.setItem('token', token);
            this.user = this.getUser();
            return this.appCommon.$q.when(true);
        };
        AuthService.prototype.getAccessToken = function () {
            return this.appCommon.$window.sessionStorage.getItem('token');
        };
        AuthService.prototype.logout = function () {
            var _this = this;
            return this.apiService.post('accounts/logout').finally(function () {
                _this.clearToken();
                _this.clearSession();
                return _this.authenticate(true).then(function () {
                    _this.appCommon.navigateHome();
                    return _this.appCommon.$q.when(true);
                });
            });
        };
        AuthService.prototype.clearToken = function () {
            this.appCommon.$window.sessionStorage.removeItem('token');
        };
        AuthService.prototype.clearSession = function () {
            this.appCommon.$cookieStore.remove('stdx.session');
        };
        AuthService.prototype.authenticate = function (skipLogout) {
            var _this = this;
            var deferred = this.appCommon.$q.defer();
            this.apiService.post('accounts/authenticate')
                .success(function (res) {
                _this.setAccessToken(res.token);
                deferred.resolve();
            })
                .error(function () {
                deferred.reject();
                if (!skipLogout)
                    _this.logout();
            });
            return deferred.promise;
        };
        AuthService.prototype.isAuthenticated = function () {
            return this.appCommon.$window.sessionStorage.getItem('token') != null;
        };
        AuthService.prototype.isAuthorized = function (roles) {
            if (!this.isAuthenticated())
                return false;
            var explicit = angular.isDefined(roles);
            var user = this.getUser();
            if (!explicit) {
                return user.hasRoles('user');
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
            if (!this.appCommon.$window.sessionStorage.getItem('token')) {
                this.user = null;
                return this.user;
            }
            if (this.user)
                return this.user;
            var payload = this.jwtHelper.decodeToken(this.appCommon.$window.sessionStorage.getItem('token'));
            var user = new GrafikaApp.User();
            user._id = payload._id;
            user.firstName = payload.given_name || payload.firstName;
            user.lastName = payload.family_name || payload.lastName;
            user.username = payload.username;
            user.email = payload.email;
            user.roles = payload.roles;
            return user;
        };
        AuthService.$inject = [
            '$rootScope',
            'appCommon',
            'apiService',
            'jwtHelper'
        ];
        return AuthService;
    }());
    GrafikaApp.AuthService = AuthService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=auth-service.js.map