var GrafikaApp;
(function (GrafikaApp) {
    function AuthInterceptor($cookies, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = $cookies.get('token');
                if (!config.cors && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status == 401 || response.status == 400) {
                    $location.url('/');
                }
                return response; //return response || appCommon.$q.when(response);
            }
        };
    }
    GrafikaApp.AuthInterceptor = AuthInterceptor;
    function HttpInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        // disable sending deflate to IE
        // because this browser does not really support deflate properly
        // https://connect.microsoft.com/IE/feedback/details/1007412/interop-wininet-does-not-support-content-encoding-deflate-properly
        if (isIE()) {
            $httpProvider.defaults.headers.get['X-Inflate-Frames'] = 'true';
        }
    }
    GrafikaApp.HttpInterceptor = HttpInterceptor;
    function isIE() {
        return angular.isDefined(window.document["documentMode"]);
    }
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/app-http.js.map