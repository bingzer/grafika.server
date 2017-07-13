module GrafikaApp {
    export class AppController extends AuthController {
        version: string = '';
        buildTimestamp: string = '';
        feedback: Feedback = new Feedback();
        feedbackCategories: string[] = Feedback.categories;
        sharing: ShareData;
        
        versionInfos: Array<VersionInfo> = new Array<VersionInfo>();

        public static $inject = ['appCommon', 'appEnvironment', 'authService', 'apiService', 'uxService', 'animationService', 'frameService', '$rootScope'];
        constructor(
            appCommon: AppCommon,
            appEnvironment: any,
            authService: AuthService,
            public apiService: ApiService,
            public uxService: UxService,
            public animationService: AnimationService,
            public frameService: FrameService,
            private $rootScope: ng.IRootScopeService
        )
        {
            super(appCommon, authService);
            this.version = appCommon.appConfig.appVersion;
            this.buildTimestamp = appCommon.appConfig.appBuildTimestamp;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            this.appCommon.appConfig.apiBaseUrl = appEnvironment.apiEndpoint;
            this.sharing = {
                url: appCommon.appConfig.baseUrl,
                description: 'Grafika - Super simple animation maker for web and Android',
                name: 'Grafika',
                imageUrl: `${appCommon.appConfig.baseUrl}assets/img/logon.png`
            }

            this.authService.authenticate(true);
            
            $rootScope.$on('$stateChangeStart', (event, toState: ng.ui.IState, toParams: ng.ui.IStateParamsService, fromState, fromParams) => {
                // -- Roles
                if (toState.data && toState.data.roles){
                    let user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)){
                        if (!authService.isAuthenticated()){
                            let queryString = encodeURIComponent(this.appCommon.$location.url())
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
                // -- banner Grafika
                if (this.appCommon.$window['bannerGrafika']) {
                    this.appCommon.$window['bannerGrafika'].destroy();
                    this.appCommon.$window['bannerGrafika'] = undefined;
                }
                
                this.uxService.closeSidenav();
            });

            let query = appCommon.$location.search();
            if (query) {
                if (query.action){
                    if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                        appCommon.showModalDialog('app/account/reset.html', 'ResetController', undefined, { hash: query.hash, email: query.user })
                                .then(() => appCommon.navigate("/login") );
                    }
                    else if(query.action == 'authenticate' && query.token) {
                        this.authService.setAccessToken(query.token);
                        this.authService.authenticate().then(() => this.appCommon.navigateHome());
                    }
                    else 
                        appCommon.alert('Unknown action or link has expired');
                    this.appCommon.cleanUrlQueries();
                }
                else if(query.feedback){
                    this.feedback.category = query.category;
                    this.feedback.subject = query.subject;
                    this.feedback.email = query.email;
                    this.feedback.lean = query.lean;
                    this.appCommon.cleanUrlQueries(); 
                }
            }

            apiService.getStatus().then((info) => this.addVersionInfo(info.data));

            var g = new Grafika();
            this.addVersionInfo({ name: "Grafika.js", description: "", version: g.version, url: "https://github.com/bingzer/grafika.js" });
            this.addVersionInfo({ name: "Grafika Client", description: "", version: appCommon.appConfig.appVersion, url: "https://github.com/bingzer/grafika.client"});
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
            let bannerGrafika: Grafika.IGrafika = this.appCommon.$window['bannerGrafika'];
            if (!bannerGrafika){
                bannerGrafika = new Grafika();
                this.appCommon.$window['bannerGrafika'] = bannerGrafika;
            }

            this.animationService.getRandom()
                .then((res) => {
                    bannerGrafika.initialize('#banner-canvas', { debugMode: false, drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
                    bannerGrafika.setAnimation(res.data);
                    angular.element("#banner-canvas-container")
                        .addClass(res.data.width > res.data.height ? "landscape" : "portrait")
                        .parent(".banner").attr("title", res.data.name + " by " + res.data.author);
                    return this.frameService.get(res.data);
                })
                .then((res) => {
                    bannerGrafika.setFrames(res.data);
                    bannerGrafika.play();
                });
        }

        media(media) {
            return this.appCommon.$mdMedia(media);
        }

        isAuthenticated(): boolean {
            return this.authService.isAuthenticated();
        }

        addVersionInfo(versionInfo: VersionInfo) {
            if (this.versionInfos.filter(v => v.name == versionInfo.name).length == 0)
                this.versionInfos.push(versionInfo);
            this.versionInfos.filter(v => v.name == versionInfo.name)[0] = versionInfo;
        }

        getVersionInfo(name: string) {
            return this.versionInfos.filter(v => v.name == name)[0];
        }
    }
}