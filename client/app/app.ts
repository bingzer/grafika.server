module GrafikaApp {
    const app = angular.module('app', [
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
    app.directive('imageUploader', ImageUploaderDirective.factory());
    app.directive('noResult', NoResultDirective.factory());
    app.directive('fetchMore', FetchMoreDirective.factory());
    app.directive('ratingStars', RatingStarsDirective.factory());
    app.directive('includeMarkdown', IncludeMarkdownDirective.factory());
    app.directive('gfSpinner', GfSpinner.factory());
    app.directive('avatar', AvatarDirective.factory());

    app.service('uxService', UxService);
    app.service('apiService', ApiService);
    app.service('authService', AuthService);
    app.service('animationService', AnimationService);
    app.service('frameService', FrameService);
    app.service('resourceService', ResourceService);
    app.service('userService', UserService);
    app.service('adminService', AdminService);

    app.controller('AppController', AppController);
    app.controller('ForgetController', ForgetController);
    app.controller('LoginController', LoginController);
    app.controller('RegisterController', RegisterController);
    app.controller('ResetController', ResetController);
    app.controller('ProfileController', ProfileController);
    app.controller('SettingsController', SettingsController);
    app.controller('PasswordController', PasswordController);
    app.controller('AdminController', AdminController);
    app.controller('AnimationCreateController', AnimationCreateController);
    app.controller('AnimationDetailController', AnimationDetailController);
    app.controller('AnimationEditController', AnimationEditController);
    app.controller('AnimationDrawingController', AnimationDrawingController);
    app.controller('AnimationListController', AnimationListController);
    app.controller('AnimationPlaybackController', AnimationPlaybackController);
    app.controller('MyAnimationsController', MyAnimationsController);
    app.controller('UserController', UserController);
}