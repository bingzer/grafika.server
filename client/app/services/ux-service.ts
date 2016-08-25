module GrafikaApp {
    export class UxService extends BaseService {
        public pageTitle: string;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, private authService: AuthService) {
			super(appCommon);

            this.pageTitle = appCommon.appConfig.appTitle;
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

        getNavigationMenus(type: string): NavigationMenu[] {
            return NavigationMenu.getMenus(this, type);
        }

        openSideNav(){
            this.appCommon.$mdSidenav('left').open();
        }

        closeSidenav(){
            this.appCommon.$mdSidenav('left').close();
        }
    }
}