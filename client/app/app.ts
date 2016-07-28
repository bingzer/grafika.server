module GrafikaApp {
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

    app.constant('appConfig', new AppConfig());

    app.service('appCommon', AppCommon);
    app.factory('authInterceptor', AuthInterceptor);

    app.config(Routes);
    app.config(HttpInterceptor);
    app.config(Theme);    

    app.filter('keyboardShortcut', KeyboardFilter);

    app.directive('activeLink', ActiveLinkDirective.factory());

    app.service('uxService', UxService);
    app.service('apiService', ApiService);
    app.service('authService', AuthService);
    app.service('animationService', AnimationService);
    app.service('frameService', FrameService);
    app.service('resourceService', ResourceService);
    app.service('userService', UserService);

    app.controller('AppController', AppController);
    app.controller('MainController', MainController);
    app.controller('ForgetController', ForgetController);
    app.controller('LoginController', LoginController);
    app.controller('RegisterController', RegisterController);
    app.controller('ResetController', ResetController);
    app.controller('ProfileController', ProfileController);
    app.controller('PasswordController', PasswordController);
    app.controller('AnimationCreateController', AnimationCreateController);
    app.controller('AnimationDetailController', AnimationDetailController);
    app.controller('AnimationEditController', AnimationEditController);
    app.controller('AnimationDrawingController', AnimationDrawingController);
    app.controller('AnimationListController', AnimationListController);
    app.controller('AnimationPlaybackController', AnimationPlaybackController);
    app.controller('MyAnimationsController', MyAnimationsController);
    app.controller('UserController', UserController);
}