module GrafikaApp {
    export function AuthInterceptor(
        $window: ng.IWindowService,
        $location: ng.ILocationService
    ) : ng.IHttpInterceptor  
    {
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
                return response; //return response || appCommon.$q.when(response);
            }
        };
    }

    export function HttpInterceptor($httpProvider: ng.IHttpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

}