module GrafikaApp {
    export class NavigationMenu {
        constructor(public name: string, 
                    public sref: string,
                    public onClick: ((app: AppController) => void),
                    public icon: string,
                    public types: string[],
                    public visible: (ux: UxService) => boolean){
        }

        public static getMenus(ux: UxService, type?: string): NavigationMenu[] {
            let menus: NavigationMenu[] = [];
            NavigationMenu.Menus.forEach((menu) => {
                if (type && menu.types.indexOf(type) == -1) return;
                if (menu.visible(ux)) menus.push(menu);
                if (!menu.onClick && menu.sref) {
                    menu.onClick = (app) => app.goto(menu.sref);
                }
            });
            return menus;
        }

        private static Menus = [
            new NavigationMenu('Home', undefined, (app) => app.navigate('/') , 'cloud', ['sidenav'], (ux) => ux.isAuthenticated()),

            new NavigationMenu('Public Animations', 'public-animations', undefined, 'video_library', ['header', 'sidenav'], (ux) => { return true; }),
            new NavigationMenu('My Backgrounds', 'my-backgrounds', undefined, 'photo', ['header', 'sidenav'], (ux) => ux.isAuthorized('user')),
            new NavigationMenu('My Animations', 'my-animations', undefined, 'movie', ['header', 'sidenav'], (ux) => ux.isAuthorized('user')),
            new NavigationMenu('Administration', 'admin', undefined, 'assignment_ind', ['header', 'sidenav'], (ux) => ux.isAuthorized('administrator')),
            new NavigationMenu('Login', 'login', undefined, 'lock_outline', ['header', 'sidenav'], (ux) => !ux.isAuthenticated()),
            
            new NavigationMenu('Profile', 'profile', undefined, 'person', ['sidenav'], (ux) => ux.isAuthenticated()),
            new NavigationMenu('Settings', 'settings', undefined, 'settings', ['sidenav'], (ux) => ux.isAuthenticated()),
            new NavigationMenu('Logout', undefined, (app) => app.confirmLogout(), 'lock_outline', ['sidenav'], (ux) => ux.isAuthenticated()),
        ];
    }
}