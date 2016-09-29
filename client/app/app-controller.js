var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AppController = (function (_super) {
        __extends(AppController, _super);
        function AppController(appCommon, authService, apiService, uxService, $rootScope) {
            var _this = this;
            _super.call(this, appCommon, authService);
            this.apiService = apiService;
            this.uxService = uxService;
            this.$rootScope = $rootScope;
            this.version = '';
            this.buildTimestamp = '';
            this.feedback = new GrafikaApp.Feedback();
            this.feedbackCategories = GrafikaApp.Feedback.categories;
            this.version = appCommon.appConfig.appVersion;
            this.buildTimestamp = appCommon.appConfig.appBuildTimestamp;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            this.authService.authenticate(true);
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.roles) {
                    var user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)) {
                        _this.appCommon.navigateHome();
                    }
                }
                _this.uxService.pageTitle = _this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    _this.uxService.pageTitle = toState.data.pageTitle;
                }
            });
            var query = appCommon.$location.search();
            if (query) {
                if (query.action) {
                    if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                        appCommon.showDialog('app/account/reset.html', 'ResetController', undefined, { hash: query.hash, email: query.user })
                            .then(function () { return appCommon.navigate("/login"); });
                    }
                    else if (query.action == 'authenticate')
                        this.authService.authenticate().then(function () { return _this.appCommon.navigateHome(); });
                    else
                        appCommon.alert('Unknown action or link has expired');
                    this.cleanUrlQueries();
                }
                else if (query.feedback && query.category && query.subject) {
                    this.feedback.category = query.category;
                    this.feedback.subject = query.subject;
                    this.cleanUrlQueries();
                }
            }
        }
        AppController.prototype.login = function (evt) {
            this.appCommon.showDialog('app/account/login-dialog.html', 'LoginController', evt);
        };
        AppController.prototype.register = function (evt) {
            this.appCommon.showDialog('app/account/register.html', 'RegisterController', evt);
        };
        AppController.prototype.confirmLogout = function () {
            var _this = this;
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(function () {
                _this.appCommon.showLoadingModal();
                return _this.authService.logout();
            })
                .then(function () {
                _this.appCommon.toast('Successfully logged out');
                _this.appCommon.hideLoadingModal();
            });
        };
        AppController.prototype.sendFeedback = function () {
            var _this = this;
            this.apiService.post('content/feedback', this.feedback)
                .then(function (res) {
                _this.appCommon.toast('Feedback is submitted!');
                return _this.appCommon.$q.when(true);
            })
                .finally(function () { return _this.feedback = new GrafikaApp.Feedback(); });
        };
        AppController.prototype.getAppVersion = function () {
            return this.appCommon.appConfig.appVersion;
        };
        AppController.prototype.navigate = function (path) {
            this.appCommon.navigate(path);
        };
        AppController.prototype.goto = function (to, params) {
            this.appCommon.$state.go(to, params);
        };
        AppController.prototype.initGrafika = function () {
            if (this.isAuthorized('user'))
                return;
            var bannerGrafika = this.appCommon.$window['bannerGrafika'];
            if (!bannerGrafika) {
                bannerGrafika = new Grafika();
            }
            bannerGrafika.initialize('#banner-canvas', { debugMode: false, drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            bannerGrafika.demo.initialize('alphabet');
            bannerGrafika.getAnimation().timer = 500;
            bannerGrafika.play();
            this.$rootScope.$on('$stateChangeStart', function (e) {
                bannerGrafika.pause();
            });
        };
        AppController.prototype.media = function (media) {
            return this.appCommon.$mdMedia(media);
        };
        AppController.prototype.cleanUrlQueries = function () {
            var keys = this.appCommon.$location.search();
            var loc = this.appCommon.$location;
            Object.keys(keys).forEach(function (key) {
                delete loc.search(key, null);
            });
            this.appCommon.$location.hash(null);
        };
        AppController.$inject = ['appCommon', 'authService', 'apiService', 'uxService', '$rootScope'];
        return AppController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AppController = AppController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-controller.js.map