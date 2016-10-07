module GrafikaApp {
    export class AppController extends AuthController {
        version: string = '';
        buildTimestamp: string = '';
        feedback: Feedback = new Feedback();
        feedbackCategories: string[] = Feedback.categories;

        public static $inject = ['appCommon', 'authService', 'apiService', 'uxService', '$rootScope'];
        constructor(
            appCommon: AppCommon,
            authService: AuthService,
            public apiService: ApiService,
            public uxService: UxService,
            private $rootScope: ng.IRootScopeService
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
                        if (!authService.isAuthenticated()){
                            let queryString = encodeURIComponent(this.appCommon.$location.path())
                            this.appCommon.navigate(`/login`).search('url', queryString);
                        }
                        else {
                            this.appCommon.navigateHome();
                        }
                        //this.appCommon.$state.go('login', { url: this.appCommon.$location.path() });
                    }
                }
                // -- Page
                this.uxService.pageTitle = this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    this.uxService.pageTitle = toState.data.pageTitle;
                }
                
                this.uxService.closeSidenav();
            });

            let query = appCommon.$location.search();
            if (query) {
                if (query.action){
                    if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                        appCommon.showDialog('app/account/reset.html', 'ResetController', undefined, { hash: query.hash, email: query.user })
                                .then(() => appCommon.navigate("/login") );
                    }
                    else if(query.action == 'authenticate')
                        this.authService.authenticate().then(() => this.appCommon.navigateHome());
                    else 
                        appCommon.alert('Unknown action or link has expired');
                    this.appCommon.cleanUrlQueries();
                }
                else if(query.feedback && query.category && query.subject){
                    this.feedback.category = query.category;
                    this.feedback.subject = query.subject;
                    this.appCommon.cleanUrlQueries(); 
                }
            }
        }

        login(evt: MouseEvent): void {
            this.appCommon.showDialog('app/account/login-dialog.html', 'LoginController', evt);
        }

        register(evt: MouseEvent): void {
            this.appCommon.showDialog('app/account/register.html', 'RegisterController', evt);
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
                    this.appCommon.$mdSidenav('left').close();
                });
        }

        sendFeedback() {
            this.apiService.post('content/feedback', this.feedback)
                .then((res) => {
                    this.appCommon.toast('Feedback is submitted!');
                    return this.appCommon.$q.when(true);
                })
                .finally(() => this.feedback = new Feedback() );
        }

        getAppVersion() {
            return this.appCommon.appConfig.appVersion;
        }

        navigate(path: string) {
            this.appCommon.navigate(path);
        }        

        goto(to: string, params?: string) {
            this.appCommon.$state.go(to, params);
        }

        initGrafika() {
            if (this.isAuthorized('user')) return;
            
            let bannerGrafika = this.appCommon.$window['bannerGrafika'];
            if (!bannerGrafika){
                bannerGrafika = new Grafika();
            }
            bannerGrafika.initialize('#banner-canvas', { debugMode: false, drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
            bannerGrafika.demo.initialize('alphabet');
            bannerGrafika.getAnimation().timer = 500;
            bannerGrafika.play();
            
            this.$rootScope.$on('$stateChangeStart', (e) => {
                bannerGrafika.pause();
            });
        }

        media(media) {
            return this.appCommon.$mdMedia(media);
        }
    }
}