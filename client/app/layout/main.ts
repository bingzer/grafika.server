module GrafikaApp {
    export class MainController extends AuthController {
        public static $inject = ['appCommon', 'authService', 'animationService', '$rootScope'];
        constructor(appCommon: AppCommon, authService: AuthService, 
            private animationService: AnimationService,
            private $rootScope: ng.IRootScopeService
        ){
            super(appCommon, authService);

            let query = appCommon.$location.search();
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
                else if(query.action == 'authenticate') {
                    this.authService.authenticate().then(() => this.appCommon.navigateHome());
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
                    this.appCommon.showLoadingModal();
                    return this.authService.logout();
                })
                .then(() => {
                    this.appCommon.toast('Successfully logged out');
                    this.appCommon.hideLoadingModal();
                });
        }

        initGrafika() {
            if (this.isAuthorized('user')) return;
            
            let bannerGrafika = this.appCommon.$window['bannerGrafika'];
            if (!bannerGrafika){
                bannerGrafika = new Grafika();
            }
            bannerGrafika.initialize('#banner-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            bannerGrafika.demo.initialize('alphabet');
            bannerGrafika.getAnimation().timer = 500;
            bannerGrafika.play();
            
            this.$rootScope.$on('$stateChangeStart', (e) => {
                bannerGrafika.pause();
            });
        }

        getAppVersion() {
            return this.appCommon.appConfig.appVersion;
        }

        navigate(path: string) {
            this.appCommon.navigate(path);
        }
        
        private cleanUrlQueries(){
            let keys = this.appCommon.$location.search();
            let loc = this.appCommon.$location;
            Object.keys(keys).forEach((key) => {
               delete loc.search(key, null); 
            });

            this.appCommon.$location.hash(null);
        }
    }
}