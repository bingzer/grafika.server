module GrafikaApp {
    export class AppController extends AuthController {
        version: string = '';
        buildTimestamp: string = '';
        feedback: Feedback = new Feedback();
        feedbackCategories: string[] = ['Just saying Hi!', 'Bug', 'Features', 'Other'];

        public static $inject = ['appCommon', 'apiService', 'authService', 'uxService', '$rootScope'];
        constructor(
            appCommon: AppCommon,
            private apiService: ApiService,
            authService: AuthService,
            public uxService: UxService,
            $rootScope: ng.IRootScopeService
        )
        {
            super(appCommon, authService);
            this.version = appCommon.appConfig.appVersion;
            this.buildTimestamp = appCommon.appConfig.appBuildTimestamp;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            this.authService.authenticate(true);
            
            $rootScope.$on('$stateChangeStart', (event, toState: ng.ui.IState, toParams: ng.ui.IStateParamsService, fromState, fromParams) => {
                // -- Roles
                if (toState.data && toState.data.roles){
                    let user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)){
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

        getNavigationMenus(): NavigationMenu[] {
            return NavigationMenu.getMenus(this);
        }

        sendFeedback() {
            this.apiService.post('content/feedback', this.feedback)
                .then((res) => {
                    this.appCommon.toast('Feedback is submitted!');
                    return this.appCommon.$q.when(true);
                })
                .finally(() => this.feedback = new Feedback() );
        }

        openSideNav(){
            this.appCommon.$mdSidenav('left').open();
        }

        closeSidenav(){
            this.appCommon.$mdSidenav('left').close();
        }
    }
}