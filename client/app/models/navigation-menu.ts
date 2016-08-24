module GrafikaApp {
    export class NavigationMenu {
        constructor(public name: string, 
                    public sref: string,
                    public icon: string,
                    public visible: (auth: AuthController) => boolean){
        }

        public static getMenus(auth: AuthController): NavigationMenu[] {
            let menus: NavigationMenu[] = [];
            NavigationMenu.Menus.forEach((menu) => {
                if (menu.visible(auth)) menus.push(menu);
            });
            return menus;
        }

        private static Menus = [
            new NavigationMenu('Login', 'login', 'lock_outline', (auth) => !auth.isAuthenticated()),
            new NavigationMenu('My Animations', 'my-animations', 'movie', (auth) => auth.isAuthorized('user')),
            new NavigationMenu('Administration', 'admin', 'assignment_ind', (auth) => auth.isAuthorized('administrator'))
        ];
    }
}