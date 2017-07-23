module GrafikaApp {
    export module Drawing {
        export const app = angular.module('app', [
            'ui.router',
            'ngMaterial',
            'ngCookies',
            'ngMessages',
            'ngSanitize',

            'angular-jwt',
            'angularSpectrumColorpicker',
            //'angularUtils.directives.dirDisqus',
            //// -- analytics + adsense
            //'angulartics',
            //'angulartics.google.analytics',
            //'angular-google-adsense',
            //'angulike'
        ]);

        export declare var animationId: string;

        app.constant('appConfig', GrafikaApp.Configuration);

        app.service('appCommon', AppCommon);
        app.factory('authInterceptor', GrafikaApp.Drawing.AppAuthInterceptor);

        app.config(GrafikaApp.Drawing.AppRoutes);
        app.config(GrafikaApp.Drawing.AppHttpInterceptor);
        app.config(GrafikaApp.Drawing.Theme);

        app.filter('capitalizeFirstLetter', GrafikaApp.Drawing.Filters.CapitalizeFirstLetterFilter);
        
        app.directive('imageUploader', GrafikaApp.Drawing.Directives.ImageUploaderDirective.factory());
        app.directive('contextMenu', GrafikaApp.Drawing.Directives.ContextMenuDirective.factory());
        
        app.service('apiService', GrafikaApp.Drawing.Services.ApiService);
        app.service('authService', GrafikaApp.Drawing.Services.AuthService);
        app.service('animationService', GrafikaApp.Drawing.Services.AnimationService);
        app.service('frameService', GrafikaApp.Drawing.Services.FrameService);
        app.service('resourceService', GrafikaApp.Drawing.Services.ResourceService);
        
        app.controller('DrawingController', GrafikaApp.Drawing.Controllers.DrawingController);

        window.onerror = (err) => console.error(err);
    }
}

