module GrafikaApp {
    export module Drawing {

        export function AppHttpInterceptor($httpProvider: ng.IHttpProvider) {
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

        function isIE() {
            return angular.isDefined(window.document["documentMode"]);
        }
    }
}