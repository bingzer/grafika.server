module GrafikaApp {
    export class Base {

        public static $inject = ['appCommon'];
        constructor(protected appCommon: AppCommon) {
            // nothing
        }
    }

    export class BaseService extends Base {
        constructor(appCommon: AppCommon){
            super(appCommon)
        }
    }

    /**
     * Base controller
     */
    export class BaseController extends Base {
        constructor(public appCommon: AppCommon){
            super(appCommon)
        }
    }

    /**
     * Has auth stuffs
     */
    export class AuthController extends BaseController {
        public static $inject = ['appCommon', 'authService'];
        constructor(appCommon: AppCommon, protected authService: AuthService) {
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
    
    /**
     * Dialog controller
     */
    export abstract class DialogController extends BaseController {
        constructor(appCommon: AppCommon){
            super(appCommon)
        }

        close(response?: any): ng.IPromise<any> {
            return this.appCommon.$mdDialog.hide(response);
        }

        cancel() {
            this.appCommon.$mdDialog.cancel();
        }
    }
}