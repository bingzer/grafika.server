var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var MainController = (function (_super) {
        __extends(MainController, _super);
        function MainController(appCommon, authService, animationService, $rootScope) {
            var _this = this;
            _super.call(this, appCommon, authService);
            this.animationService = animationService;
            this.$rootScope = $rootScope;
            var query = appCommon.$location.search();
            if (query && query.action) {
                if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                    appCommon.$mdDialog.show({
                        controller: 'ResetController',
                        controllerAs: 'vm',
                        templateUrl: 'app/account/reset.html',
                        parent: angular.element(document.body),
                        locals: { hash: query.hash, email: query.user }
                    }).then(function () { return appCommon.navigate("/login"); });
                    this.cleanUrlQueries();
                }
                else if (query.action == 'authenticate') {
                    this.authService.authenticate().then(function () { return _this.appCommon.navigateHome(); });
                    this.cleanUrlQueries();
                }
                else {
                    appCommon.alert('Unknown action or link has expired');
                    this.cleanUrlQueries();
                }
            }
        }
        MainController.prototype.close = function () {
            this.appCommon.$mdDialog.hide();
        };
        MainController.prototype.login = function (evt) {
            this.appCommon.showDialog('LoginController', 'app/account/login-dialog.html', evt, 'vm');
        };
        MainController.prototype.register = function (evt) {
            this.appCommon.showDialog('RegisterController', 'app/account/register.html', evt, 'vm');
        };
        MainController.prototype.confirmLogout = function () {
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
        MainController.prototype.initGrafika = function () {
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
        MainController.prototype.getAppVersion = function () {
            return this.appCommon.appConfig.appVersion;
        };
        MainController.prototype.navigate = function (path) {
            this.appCommon.navigate(path);
        };
        MainController.prototype.cleanUrlQueries = function () {
            var keys = this.appCommon.$location.search();
            var loc = this.appCommon.$location;
            Object.keys(keys).forEach(function (key) {
                delete loc.search(key, null);
            });
            this.appCommon.$location.hash(null);
        };
        MainController.$inject = ['appCommon', 'authService', 'animationService', '$rootScope'];
        return MainController;
    }(GrafikaApp.AuthController));
    GrafikaApp.MainController = MainController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=main.js.map