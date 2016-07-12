(function (angular, app){
    // $httpOrivder
    app.config(function ($httpProvider) {
        //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('authInterceptor');
    });
		
    // -- AuthInterceptor ($http interceptor)
    app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (!config.cors && $window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function (response) {
                if (response.status == 401 || response.status == 400) {
                    $location.url('/');
                }
                return response || $q.when(response);
            }
        };
    });
})(window.angular, window.angular.app);