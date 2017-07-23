module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export abstract class AuthController extends BaseController {
                public static $inject = ['appCommon', 'authService'];
                constructor(protected appCommon: AppCommon, protected authService: Services.AuthService) {
                    super(appCommon);
                }

                isAuthenticated(): boolean {
                    return this.authService.isAuthenticated();
                }

                isAuthorized(roles: string | [string]): boolean {
                    return this.authService.isAuthorized(roles);
                }

                getUser(): Grafika.IUser {
                    return this.authService.getUser();
                }
            }
        }
    }
}