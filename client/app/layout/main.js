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
                    }).then(appCommon.navigateHome);
                    this.cleanUrlQueries();
                }
                else {
                    appCommon.alert('Unknown action or link has expired');
                    this.cleanUrlQueries();
                }
            }
        }
        MainController.prototype.confirmLogout = function () {
            var _this = this;
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(function () {
                return _this.appCommon.showLoadingModal();
            }).then(function () {
                return _this.authService.logout();
            })
                .then(function () {
                return _this.appCommon.hideLoadingModal();
            })
                .then(function () {
                return _this.appCommon.toast('Successfully logged out');
            });
        };
        MainController.prototype.initGrafika = function () {
            if (this.isAuthorized('user'))
                return;
            var grafikaIntro = this.appCommon.$window['grafikaIntro'];
            if (!grafikaIntro) {
                grafikaIntro = new Grafika();
            }
            grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            grafikaIntro.demo.initialize('alphabet');
            grafikaIntro.getAnimation().timer = 500;
            grafikaIntro.play();
            this.$rootScope.$on('$stateChangeStart', function (e) {
                grafikaIntro.pause();
            });
        };
        MainController.prototype.cleanUrlQueries = function () {
            var keys = this.appCommon.$location.search();
            var loc = this.appCommon.$location;
            Object.keys(keys).forEach(function (key) {
                delete loc.search(key, null);
            });
        };
        return MainController;
    }(GrafikaApp.AuthController));
    GrafikaApp.MainController = MainController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=main.js.map