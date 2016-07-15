var GrafikaApp;
(function (GrafikaApp) {
    var HomeController = (function () {
        function HomeController($window, $rootScope, $mdDialog, appCommon, authService, animationService) {
            this.$window = $window;
            this.$rootScope = $rootScope;
            this.$mdDialog = $mdDialog;
            this.appCommon = appCommon;
            this.authService = authService;
            this.animationService = animationService;
            var grafikaIntro = $window['grafikaIntro'];
            if (!grafikaIntro) {
                grafikaIntro = new Grafika();
            }
        }
        HomeController.prototype.initGrafika = function () {
            if (this.isAuthorize('user'))
                return;
            grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            grafikaIntro.demo.initialize('alphabet');
            grafikaIntro.getAnimation().timer = 500;
            grafikaIntro.play();
            $rootScope.$on('$stateChangeStart', function (e) {
                grafikaIntro.pause();
            });
        };
        HomeController.prototype.isAuthorize = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        HomeController.prototype.getUser = function () {
            return this.authService.getUser();
        };
        HomeController.$inject = [
            '$window',
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'authService',
            'animationService'
        ];
        return HomeController;
    }());
    GrafikaApp.HomeController = HomeController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=home.js.map