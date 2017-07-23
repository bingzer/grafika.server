module GrafikaApp {
    export module Drawing {
        export function AppAuthInterceptor(
            $cookies: ng.cookies.ICookiesService,
            $location: ng.ILocationService
        ): ng.IHttpInterceptor {
            return {
                request: (config: any) => {
                    config.headers = config.headers || {};
                    let token = $cookies.get('token');
                    if (!config.cors && token) {
                        config.headers.Authorization = 'Bearer ' + token;
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

    }
}