module grafikaApp {
    export class Maincontroller {
        public static $inject = [
            'appCommon',
            'authService'
        ];

        constructor(
            public appCommon: AppCommon,
            public authService: AuthService
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

        isAuthorize(roles: string | [string]): boolean {
            return this.authService.isAuthorized(roles);
        }

        getUser(): User {
            return this.authService.getUser();
        }

        confirmLogout(): void {
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(this.appCommon.showLoadingModal)
                .then(this.authService.logout)
                .then(this.appCommon.hideLoadingModal)
                .then(function (){
                    this.appCommon.toast('Successfully logged out');
                });
        }
            
        
        private cleanUrlQueries(){
            Object.keys(this.appCommon.$location.search()).forEach(function (key){
               delete this.appCommon.$location.search()[key]; 
            });
        }
    }
}