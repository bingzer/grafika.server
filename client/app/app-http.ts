module GrafikaApp {
    export function AuthInterceptor(
        $window: ng.IWindowService,
        $location: ng.ILocationService
    ) : ng.IHttpInterceptor  
    {
        return {
            request: (config: any) => {
                config.headers = config.headers || {};
                if (!config.cors && $window.sessionStorage.getItem('token')) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
                }
                return config;
            },
            response: (response) => {
                if (response.status == 401 || response.status == 400) {
                    $location.url('/');
                }
                return response; //return response || appCommon.$q.when(response);
            }
        };
    }

    export function HttpInterceptor($httpProvider: ng.IHttpProvider) {
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
    }

}