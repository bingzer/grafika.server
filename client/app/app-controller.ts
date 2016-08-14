module GrafikaApp {
    export class AppController extends AuthController {
        version: string = '';

        public static $inject = ['appCommon', 'authService', 'uxService', '$rootScope'];
        constructor(
            appCommon: AppCommon,
            authService: AuthService,
            public uxService: UxService,
            $rootScope: ng.IRootScopeService
        )
        {
            super(appCommon, authService);
            this.version = appCommon.appConfig.appVersion;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            
            $rootScope.$on('$stateChangeStart', (event, toState: ng.ui.IState, toParams: ng.ui.IStateParamsService, fromState, fromParams) => {
                // -- Roles
                if (toState.data && toState.data.roles){
                    let user = authService.getUser();
                    if (!user.hasRoles(toState.data.roles)){
                        this.appCommon.navigateHome();
                    }
                }
                // -- Page
                this.uxService.pageTitle = this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    this.uxService.pageTitle = toState.data.pageTitle;
                }

            });
        }
    }
}