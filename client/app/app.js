var GrafikaApp;
(function (GrafikaApp) {
    var app = angular.module('app', [
        'ui.router',
        'ngMaterial',
        'ngCookies',
        'ngMessages',
        'ngSanitize',
        'angular-jwt'
    ]);
    app.constant('appConfig', new GrafikaApp.AppConfig());
    app.service('appCommon', GrafikaApp.AppCommon);
    app.factory('authInterceptor', GrafikaApp.AuthInterceptor);
    app.config(GrafikaApp.Routes);
    app.config(GrafikaApp.HttpInterceptor);
    app.config(GrafikaApp.Theme);
    app.filter('keyboardShortcut', GrafikaApp.KeyboardFilter);
    app.service('apiService', GrafikaApp.ApiService);
    app.service('authService', GrafikaApp.AuthService);
    app.service('animationService', GrafikaApp.AnimationService);
    app.service('frameService', GrafikaApp.FrameService);
    app.controller('MainController', GrafikaApp.MainController);
    app.controller('AnimationCreateController', GrafikaApp.AnimationCreateController);
    app.controller('AnimationDetailController', GrafikaApp.AnimationDetailController);
    app.controller('AnimationEditorController', GrafikaApp.AnimationEditorController);
    app.controller('AnimationListController', GrafikaApp.AnimationListController);
    app.controller('AnimationPlaybackController', GrafikaApp.AnimationPlaybackController);
    app.controller('MyAnimationsController', GrafikaApp.MyAnimationsController);
    app.controller('ForgetController', GrafikaApp.ForgetController);
    app.controller('LoginController', GrafikaApp.LoginController);
    app.controller('RegisterController', GrafikaApp.RegisterController);
    app.controller('ResetController', GrafikaApp.ResetController);
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app.js.map