var GrafikaApp;
(function (GrafikaApp) {
    var NavigationMenu = (function () {
        function NavigationMenu(name, sref, onClick, icon, types, visible) {
            this.name = name;
            this.sref = sref;
            this.onClick = onClick;
            this.icon = icon;
            this.types = types;
            this.visible = visible;
        }
        NavigationMenu.getMenus = function (ux, type) {
            var menus = [];
            NavigationMenu.Menus.forEach(function (menu) {
                if (type && menu.types.indexOf(type) == -1)
                    return;
                if (menu.visible(ux))
                    menus.push(menu);
                if (!menu.onClick && menu.sref) {
                    menu.onClick = function (app) { return app.goto(menu.sref); };
                }
            });
            return menus;
        };
        NavigationMenu.Menus = [
            new NavigationMenu('Home', undefined, function (app) { return app.navigate('/'); }, 'cloud', ['sidenav'], function (ux) { return ux.isAuthenticated(); }),
            new NavigationMenu('Public Animations', 'public-animations', undefined, 'video_library', ['header', 'sidenav'], function (ux) { return true; }),
            new NavigationMenu('My Backgrounds', 'my-backgrounds', undefined, 'photo', ['header', 'sidenav'], function (ux) { return ux.isAuthorized('user'); }),
            new NavigationMenu('My Animations', 'my-animations', undefined, 'movie', ['header', 'sidenav'], function (ux) { return ux.isAuthorized('user'); }),
            new NavigationMenu('Administration', 'admin', undefined, 'assignment_ind', ['header', 'sidenav'], function (ux) { return ux.isAuthorized('administrator'); }),
            new NavigationMenu('Login', 'login', undefined, 'lock_outline', ['header', 'sidenav'], function (ux) { return !ux.isAuthenticated(); }),
            new NavigationMenu('Profile', 'profile', undefined, 'person', ['sidenav'], function (ux) { return ux.isAuthenticated(); }),
            new NavigationMenu('Settings', 'settings', undefined, 'settings', ['sidenav'], function (ux) { return ux.isAuthenticated(); }),
            new NavigationMenu('Logout', undefined, function (app) { return app.confirmLogout(); }, 'lock_outline', ['sidenav'], function (ux) { return ux.isAuthenticated(); }),
        ];
        return NavigationMenu;
    }());
    GrafikaApp.NavigationMenu = NavigationMenu;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/models/navigation-menu.js.map