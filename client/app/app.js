var GrafikaApp;
(function (GrafikaApp) {
    var app = angular.module('app', [
        'ui.router',
        'ngMaterial',
        'ngCookies',
        'ngMessages',
        'ngSanitize',
        'angular-jwt',
        'angularSpectrumColorpicker',
        'angularUtils.directives.dirDisqus'
    ]);
    app.constant('appConfig', new GrafikaApp.AppConfig());
    app.service('appCommon', GrafikaApp.AppCommon);
    app.factory('authInterceptor', GrafikaApp.AuthInterceptor);
    app.config(GrafikaApp.Routes);
    app.config(GrafikaApp.HttpInterceptor);
    app.config(GrafikaApp.Theme);
    app.filter('keyboardShortcut', GrafikaApp.KeyboardFilter);
    app.directive('activeLink', GrafikaApp.ActiveLinkDirective.factory());
    app.service('uxService', GrafikaApp.UxService);
    app.service('apiService', GrafikaApp.ApiService);
    app.service('authService', GrafikaApp.AuthService);
    app.service('animationService', GrafikaApp.AnimationService);
    app.service('frameService', GrafikaApp.FrameService);
    app.service('resourceService', GrafikaApp.ResourceService);
    app.service('userService', GrafikaApp.UserService);
    app.controller('AppController', GrafikaApp.AppController);
    app.controller('MainController', GrafikaApp.MainController);
    app.controller('ForgetController', GrafikaApp.ForgetController);
    app.controller('LoginController', GrafikaApp.LoginController);
    app.controller('RegisterController', GrafikaApp.RegisterController);
    app.controller('ResetController', GrafikaApp.ResetController);
    app.controller('ProfileController', GrafikaApp.ProfileController);
    app.controller('PasswordController', GrafikaApp.PasswordController);
    app.controller('AnimationCreateController', GrafikaApp.AnimationCreateController);
    app.controller('AnimationDetailController', GrafikaApp.AnimationDetailController);
    app.controller('AnimationEditController', GrafikaApp.AnimationEditController);
    app.controller('AnimationDrawingController', GrafikaApp.AnimationDrawingController);
    app.controller('AnimationListController', GrafikaApp.AnimationListController);
    app.controller('AnimationPlaybackController', GrafikaApp.AnimationPlaybackController);
    app.controller('MyAnimationsController', GrafikaApp.MyAnimationsController);
    app.controller('UserController', GrafikaApp.UserController);
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app.js.map