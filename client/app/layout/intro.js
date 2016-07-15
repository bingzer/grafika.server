var GrafikaApp;
(function (GrafikaApp) {
    var IntroController = (function () {
        function IntroController($window, $rootScope, $mdDialog, appCommon, authService, animationService) {
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
            grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            grafikaIntro.demo.initialize('alphabet');
            grafikaIntro.getAnimation().timer = 500;
            grafikaIntro.play();
            $rootScope.$on('$stateChangeStart', function (e) {
                grafikaIntro.pause();
            });
        }
        IntroController.$inject = [
            '$window',
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'authService',
            'animationService'
        ];
        return IntroController;
    }());
    GrafikaApp.IntroController = IntroController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=intro.js.map