module GrafikaApp {
    export class MainController extends AuthController {
        public static $inject = ['appCommon', 'authService', 'animationService', '$rootScope'];
        constructor(appCommon: AppCommon, authService: AuthService, 
            private animationService: AnimationService,
            private $rootScope: ng.IRootScopeService
        ){
            super(appCommon, authService);

            var query = appCommon.$location.search();
            if (query && query.action){
                if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user){
                    appCommon.$mdDialog.show({
                        controller: 'ResetController',
                        controllerAs: 'vm',
                        templateUrl: 'app/account/reset.html',
                        parent: angular.element(document.body),
                        locals: { hash: query.hash, email: query.user }
                    }).then(() => appCommon.navigate("/login") );
                    this.cleanUrlQueries();
                }
                else {
                    appCommon.alert('Unknown action or link has expired');
                    this.cleanUrlQueries();
                }
            }
        }    

        confirmLogout(): void {
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(() => {
                    return this.appCommon.showLoadingModal(); 
                }).then(() => {
                    return this.authService.logout(); 
                })
                .then(() => {
                    return this.appCommon.hideLoadingModal()
                })
                .then(() => {
                    return this.appCommon.toast('Successfully logged out');
                });
        }

        initGrafika() {
            if (this.isAuthorized('user')) return;
            
            var grafikaIntro = this.appCommon.$window['grafikaIntro'];
            if (!grafikaIntro){
                grafikaIntro = new Grafika();
            }
            grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            grafikaIntro.demo.initialize('alphabet');
            grafikaIntro.getAnimation().timer = 500;
            grafikaIntro.play();
            grafikaIntro
            
            this.$rootScope.$on('$stateChangeStart', (e) => {
                grafikaIntro.pause();
            });
        }

        getAppVersion() {
            return this.appCommon.appConfig.appVersion;
        }

        navigate(path: string) {
            this.appCommon.navigate(path);
        }
        
        private cleanUrlQueries(){
            var keys = this.appCommon.$location.search();
            var loc = this.appCommon.$location;
            Object.keys(keys).forEach((key) => {
               delete loc.search(key, null); 
            });
        }
    }
}