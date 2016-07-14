module GrafikaApp {
    var app = angular.module('app', [
        'ui.router',
        'ngMaterial',
        'ngCookies',
        'ngMessages',

        'angular-jwt'
    ]);

    app.constant('appConfig', new AppConfig());

    app.service('appCommon', AppCommon);
    app.factory('authInterceptor', AuthInterceptor);

    app.config(Routes);
    app.config(HttpInterceptor);
    app.config(Theme);

    app.filter('keyboardShortcut', KeyboardFilter);

    app.service('apiService', ApiService);
    app.service('authService', AuthService);
    app.service('animationService', AnimationService);
    app.service('frameService', FrameService);

    app.controller('MainController', MainController);
    app.controller('HomeController', HomeController);
    app.controller('IntroController', IntroController);
    app.controller('AnimationCreateController', AnimationCreateController);
    app.controller('AnimationDetailController', AnimationDetailController);
    app.controller('AnimationEditorController', AnimationEditorController);
    app.controller('AnimationListController', AnimationListController);
    app.controller('MyAnimationsController', MyAnimationsController);
    app.controller('ForgetController', ForgetController);
    app.controller('LoginController', LoginController);
    app.controller('RegisterController', RegisterController);
    app.controller('ResetController', ResetController);
}