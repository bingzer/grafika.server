(function (angular) {
    'use strict';
    angular.module('app').factory('authService', ['$rootScope', 'appCommon', 'apiService', 'jwtHelper', function($rootScope, appCommon, apiService, jwtHelper) {
        
        var user = null;
        var service = {
            register: register,
            login: login,
            logout: logout,
            
            authenticate: authenticate,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getUser: getUser,
            
            clearToken: clearToken,
            setAccessToken: setAccessToken,
            getAccessToken: getAccessToken,
            
            changePassword: changePassword,
            resetPassword: resetPassword,
            
            getDisqusToken: getDisqusToken
        };

        return service;
        
        function register(user) {
            return apiService.post('accounts/register', user);
        }
        
        function login(user, provider) {
            if (!provider)
                return apiService.post('accounts', user).success(authenticate);
            else {
                window.location.href = appCommon.appConfig.apiBaseUrl + 'accounts/' + provider.toLowerCase();
                return appCommon.$q.when(true);
            }
                
        }

        function setAccessToken(token) {
            if (!token) return appCommon.$q.when(false);
            user = null;
            appCommon.$window.sessionStorage.token = token;
            user = getUser();
            return appCommon.$q.when(true);
        }
        
        function getAccessToken(){
            return appCommon.$window.sessionStorage.token;
        }

        function logout() {
            return apiService.post('accounts/logout').finally(function (){
                clearToken();
                clearSession();
                return authenticate(true).then(appCommon.navigateHome);
            });
        }

        function clearToken() {
            delete appCommon.$window.sessionStorage.token;
        }
        
        function clearSession() {
            appCommon.$cookieStore.remove('stdx.session');
        }
        
        function authenticate(skipLogout){
            var deferred = appCommon.$q.defer();
            apiService.post('accounts/authenticate')
                    .success(function (res){ 
                        setAccessToken(res.token);
                        deferred.resolve();
                    })
                    .error(function (){
                        deferred.reject();
                        if (!skipLogout) logout();
                    });
            return deferred.promise;
        }

        function isAuthenticated() {
            return appCommon.$window.sessionStorage.token != null;
        }
        
        function isAuthorized(roles) {
            if (!isAuthenticated()) 
                return false;
            var explicit = angular.isDefined(roles);
            if (!explicit){
                if (!roles) roles = ['user'];
                var route = appCommon.getCurrentRoute();
                if (route) 
                    roles = route.config.roles; 
            }
            else{
                if (!angular.isArray(roles))
                    roles = [roles];
            }
            return getUser().hasRoles(roles);
        }
        
        function changePassword(pwd){
            return apiService.post('accounts/pwd', pwd);
        }
        
        function resetPassword(user){
            return apiService.post('accounts/pwd/reset', user);
        }
        
        function getDisqusToken(){
            return apiService.get('accounts/disqus');
        }

        function getUser() {
            if (!appCommon.$window.sessionStorage.token) {
                user = null;
                return user;
            }
            if (user) return user;
            
            var token = jwtHelper.decodeToken(appCommon.$window.sessionStorage.token);
            var payload = token._doc;
            user = {
                _id: payload._id,
                firstName: payload.given_name || payload.firstName,
                lastName: payload.family_name || payload.lastName,
                username: payload.username,
                email: payload.email,
                roles: payload.roles,
                payload: payload,
                getDisplayName: function(){
                    if (this.firstName && this.lastName) return this.firstName + ' ' + this.lastName;
                    else return this.email;
                },
                prefs : payload.prefs || appCommon.appConfig.prefs,
                avatar : payload.avatar || appCommon.appConfig.defaultAvatar,
                backdrop : payload.backdrop || appCommon.appConfig.defaultBackdrop,
                hasRoles: function (names) {
                    if (!names || names.length == 0) names = ['user'];
                    var any = false;
                    for (var i = 0; i < this.roles.length; i++) {
                        for (var j = 0; j < names.length; j++) {
                            if (this.roles[i] == names[j])
                                any = true;
                            if (any) break;
                        }
                        if (any)
                            break;
                    }
                    return any;
                }
            };            
            return user;
        }
    }]);
})(window.angular);
