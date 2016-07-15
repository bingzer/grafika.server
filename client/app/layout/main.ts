module GrafikaApp {
    export class MainController {
        public static $inject = [
            '$window',
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'authService',
            'animationService'
        ];

        constructor(
            private $window: ng.IWindowService,
            private $rootScope: ng.IRootScopeService,
            private $mdDialog: ng.material.IDialogService,
            private appCommon: AppCommon,
            private authService: AuthService,
            private animationService: AnimationService
        ){            
            var query = appCommon.$location.search();
            if (query && query.action){
                if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user){
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

        isAuthorized(roles: string | [string]): boolean {
            return this.authService.isAuthorized(roles);
        }

        getUser(): User {
            return this.authService.getUser();
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
                .then(function (){
                    return this.appCommon.toast('Successfully logged out');
                });
        }

        initGrafika() {
            if (this.isAuthorized('user')) return;
            
            var grafikaIntro = this.$window['grafikaIntro'];
            if (!grafikaIntro){
                grafikaIntro = new Grafika();
            }
            grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            grafikaIntro.demo.initialize('alphabet');
            grafikaIntro.getAnimation().timer = 500;
            grafikaIntro.play();
            
            this.$rootScope.$on('$stateChangeStart', (e) => {
                grafikaIntro.pause();
            });
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