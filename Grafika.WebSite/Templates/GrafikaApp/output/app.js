var GrafikaApp;
(function (GrafikaApp) {
    var app = angular.module('app', [
        'app.env',
        'ui.router',
        'ngMaterial',
        'ngCookies',
        'ngMessages',
        'ngSanitize',
        'angular-jwt',
        'angularSpectrumColorpicker',
        'angularUtils.directives.dirDisqus',
        // -- analytics + adsense
        'angulartics',
        'angulartics.google.analytics',
        'angular-google-adsense',
        'angulike'
    ]);
    app.constant('appConfig', new GrafikaApp.AppConfig());
    app.service('appCommon', GrafikaApp.AppCommon);
    app.factory('authInterceptor', GrafikaApp.AuthInterceptor);
    app.config(GrafikaApp.Routes);
    app.config(GrafikaApp.HttpInterceptor);
    app.config(GrafikaApp.Theme);
    app.filter('keyboardShortcut', GrafikaApp.KeyboardFilter);
    app.filter('capitalizeFirstLetter', GrafikaApp.CapitalizeFirstLetterFilter);
    app.directive('activeLink', GrafikaApp.ActiveLinkDirective.factory());
    app.directive('imageUploader', GrafikaApp.ImageUploaderDirective.factory());
    app.directive('noResult', GrafikaApp.NoResultDirective.factory());
    app.directive('fetchMore', GrafikaApp.FetchMoreDirective.factory());
    app.directive('ratingStars', GrafikaApp.RatingStarsDirective.factory());
    app.directive('gfAdsense', GrafikaApp.GfAdsense.factory());
    app.directive('gfSpinner', GrafikaApp.GfSpinner.factory());
    app.directive('avatar', GrafikaApp.AvatarDirective.factory());
    app.directive('contextMenu', GrafikaApp.ContextMenuDirective.factory());
    app.service('uxService', GrafikaApp.UxService);
    app.service('apiService', GrafikaApp.ApiService);
    app.service('authService', GrafikaApp.AuthService);
    app.service('animationService', GrafikaApp.AnimationService);
    app.service('backgroundService', GrafikaApp.BackgroundService);
    app.service('frameService', GrafikaApp.FrameService);
    app.service('resourceService', GrafikaApp.ResourceService);
    app.service('userService', GrafikaApp.UserService);
    app.service('adminService', GrafikaApp.AdminService);
    app.controller('AppController', GrafikaApp.AppController);
    app.controller('ForgetController', GrafikaApp.ForgetController);
    app.controller('LoginController', GrafikaApp.LoginController);
    app.controller('RegisterController', GrafikaApp.RegisterController);
    app.controller('ResetController', GrafikaApp.ResetController);
    app.controller('ProfileController', GrafikaApp.ProfileController);
    app.controller('SettingsController', GrafikaApp.SettingsController);
    app.controller('PasswordController', GrafikaApp.PasswordController);
    app.controller('AdminController', GrafikaApp.AdminController);
    app.controller('AnimationCreateController', GrafikaApp.AnimationCreateController);
    app.controller('AnimationDetailController', GrafikaApp.AnimationDetailController);
    app.controller('AnimationEditController', GrafikaApp.AnimationEditController);
    app.controller('AnimationDrawingController', GrafikaApp.AnimationDrawingController);
    app.controller('AnimationListController', GrafikaApp.AnimationListController);
    app.controller('AnimationPlaybackController', GrafikaApp.AnimationPlaybackController);
    app.controller('MyAnimationsController', GrafikaApp.MyAnimationsController);
    app.controller('BackgroundCreateController', GrafikaApp.BackgroundCreateController);
    app.controller('BackgroundDrawingController', GrafikaApp.BackgroundDrawingController);
    app.controller('BackgroundListController', GrafikaApp.BackgroundListController);
    app.controller('MyBackgroundsController', GrafikaApp.MyBackgroundsController);
    app.controller('ResourceListController', GrafikaApp.ResourceListController);
    app.controller('UserController', GrafikaApp.UserController);
})(GrafikaApp || (GrafikaApp = {}));
window.onerror = function (err) { return console.error(err); };
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/app.js.map