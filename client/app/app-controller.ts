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
            this.version = appCommon.appConfig.appVersion;
        }
    }
}