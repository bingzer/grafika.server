var GrafikaApp;
(function (GrafikaApp) {
    var MainController = (function () {
        function MainController($window, $rootScope, $mdDialog, appCommon, authService, animationService) {
            this.$window = $window;
            this.$rootScope = $rootScope;
            this.$mdDialog = $mdDialog;
            this.appCommon = appCommon;
            this.authService = authService;
            this.animationService = animationService;
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
        MainController.prototype.isAuthorized = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        MainController.prototype.getUser = function () {
            return this.authService.getUser();
        };
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
            var grafikaIntro = this.$window['grafikaIntro'];
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
        MainController.$inject = [
            '$window',
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'authService',
            'animationService'
        ];
        return MainController;
    }());
    GrafikaApp.MainController = MainController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=main.js.map