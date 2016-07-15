var GrafikaApp;
(function (GrafikaApp) {
    function AuthInterceptor($window, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (!config.cors && $window.sessionStorage.getItem('token')) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
                }
                return config;
            },
            response: function (response) {
                if (response.status == 401 || response.status == 400) {
                    $location.url('/');
                }
                return response;
            }
        };
    }
    GrafikaApp.AuthInterceptor = AuthInterceptor;
    function HttpInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }
    GrafikaApp.HttpInterceptor = HttpInterceptor;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-http.js.map