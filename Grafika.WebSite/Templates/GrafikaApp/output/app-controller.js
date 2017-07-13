var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var AppController = (function (_super) {
        __extends(AppController, _super);
        function AppController(appCommon, appEnvironment, authService, apiService, uxService, animationService, frameService, $rootScope) {
            var _this = _super.call(this, appCommon, authService) || this;
            _this.apiService = apiService;
            _this.uxService = uxService;
            _this.animationService = animationService;
            _this.frameService = frameService;
            _this.$rootScope = $rootScope;
            _this.version = '';
            _this.buildTimestamp = '';
            _this.feedback = new GrafikaApp.Feedback();
            _this.feedbackCategories = GrafikaApp.Feedback.categories;
            _this.versionInfos = new Array();
            _this.version = appCommon.appConfig.appVersion;
            _this.buildTimestamp = appCommon.appConfig.appBuildTimestamp;
            _this.appCommon.appConfig.baseUrl = _this.appCommon.getBaseUrl();
            _this.appCommon.appConfig.apiBaseUrl = appEnvironment.apiEndpoint;
            _this.sharing = {
                url: appCommon.appConfig.baseUrl,
                description: 'Grafika - Super simple animation maker for web and Android',
                name: 'Grafika',
                imageUrl: appCommon.appConfig.baseUrl + "assets/img/logon.png"
            };
            _this.authService.authenticate(true);
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // -- Roles
                if (toState.data && toState.data.roles) {
                    var user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)) {
                        if (!authService.isAuthenticated()) {
                            var queryString = encodeURIComponent(_this.appCommon.$location.url());
                            _this.appCommon.navigate("/login").search('url', queryString);
                        }
                        else {
                            _this.appCommon.navigateHome();
                        }
                        //this.appCommon.$state.go('login', { url: this.appCommon.$location.path() });
                    }
                }
                // -- Page
                _this.uxService.pageTitle = _this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    _this.uxService.pageTitle = toState.data.pageTitle;
                }
                // -- banner Grafika
                if (_this.appCommon.$window['bannerGrafika']) {
                    _this.appCommon.$window['bannerGrafika'].destroy();
                    _this.appCommon.$window['bannerGrafika'] = undefined;
                }
                _this.uxService.closeSidenav();
            });
            var query = appCommon.$location.search();
            if (query) {
                if (query.action) {
                    if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                        appCommon.showModalDialog('app/account/reset.html', 'ResetController', undefined, { hash: query.hash, email: query.user })
                            .then(function () { return appCommon.navigate("/login"); });
                    }
                    else if (query.action == 'authenticate' && query.token) {
                        _this.authService.setAccessToken(query.token);
                        _this.authService.authenticate().then(function () { return _this.appCommon.navigateHome(); });
                    }
                    else
                        appCommon.alert('Unknown action or link has expired');
                    _this.appCommon.cleanUrlQueries();
                }
                else if (query.feedback) {
                    _this.feedback.category = query.category;
                    _this.feedback.subject = query.subject;
                    _this.feedback.email = query.email;
                    _this.feedback.lean = query.lean;
                    _this.appCommon.cleanUrlQueries();
                }
            }
            apiService.getStatus().then(function (info) { return _this.addVersionInfo(info.data); });
            var g = new Grafika();
            _this.addVersionInfo({ name: "Grafika.js", description: "", version: g.version, url: "https://github.com/bingzer/grafika.js" });
            _this.addVersionInfo({ name: "Grafika Client", description: "", version: appCommon.appConfig.appVersion, url: "https://github.com/bingzer/grafika.client" });
            return _this;
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
                _this.appCommon.$mdSidenav('left').close();
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
            var _this = this;
            var bannerGrafika = this.appCommon.$window['bannerGrafika'];
            if (!bannerGrafika) {
                bannerGrafika = new Grafika();
                this.appCommon.$window['bannerGrafika'] = bannerGrafika;
            }
            this.animationService.getRandom()
                .then(function (res) {
                bannerGrafika.initialize('#banner-canvas', { debugMode: false, drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
                bannerGrafika.setAnimation(res.data);
                angular.element("#banner-canvas-container")
                    .addClass(res.data.width > res.data.height ? "landscape" : "portrait")
                    .parent(".banner").attr("title", res.data.name + " by " + res.data.author);
                return _this.frameService.get(res.data);
            })
                .then(function (res) {
                bannerGrafika.setFrames(res.data);
                bannerGrafika.play();
            });
        };
        AppController.prototype.media = function (media) {
            return this.appCommon.$mdMedia(media);
        };
        AppController.prototype.isAuthenticated = function () {
            return this.authService.isAuthenticated();
        };
        AppController.prototype.addVersionInfo = function (versionInfo) {
            if (this.versionInfos.filter(function (v) { return v.name == versionInfo.name; }).length == 0)
                this.versionInfos.push(versionInfo);
            this.versionInfos.filter(function (v) { return v.name == versionInfo.name; })[0] = versionInfo;
        };
        AppController.prototype.getVersionInfo = function (name) {
            return this.versionInfos.filter(function (v) { return v.name == name; })[0];
        };
        AppController.$inject = ['appCommon', 'appEnvironment', 'authService', 'apiService', 'uxService', 'animationService', 'frameService', '$rootScope'];
        return AppController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AppController = AppController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/app-controller.js.map