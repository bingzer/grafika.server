module grafikaApp {
    export class IntroController {
        public static $inject = [
            '$window',
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'authService',
            'animationService'
        ];

        constructor(
            public $window: ng.IWindowService,
            public $rootScope: ng.IRootScopeService,
            public $mdDialog: ng.material.IDialogService,
            public appCommon: AppCommon,
            public authService: AuthService,
            public animationService: AnimationService
        ){
            var grafikaIntro = $window['grafikaIntro'];
            if (!grafikaIntro){
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


    }
}