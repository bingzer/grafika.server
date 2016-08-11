module GrafikaApp {
    export class AppController extends AuthController {
        version: string = '';

        public static $inject = ['appCommon', 'authService', 'uxService'];
        constructor(
            appCommon: AppCommon,
            authService: AuthService,
            public uxService: UxService
        )
        {
            super(appCommon, authService);
            this.authService.authenticate();
            this.version = appCommon.appConfig.appVersion;
        }
    }
}