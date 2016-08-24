var GrafikaApp;
(function (GrafikaApp) {
    var NavigationMenu = (function () {
        function NavigationMenu(name, sref, icon, visible) {
            this.name = name;
            this.sref = sref;
            this.icon = icon;
            this.visible = visible;
        }
        NavigationMenu.getMenus = function (auth) {
            var menus = [];
            NavigationMenu.Menus.forEach(function (menu) {
                if (menu.visible(auth))
                    menus.push(menu);
            });
            return menus;
        };
        NavigationMenu.Menus = [
            new NavigationMenu('Login', 'login', 'lock_outline', function (auth) { return !auth.isAuthenticated(); }),
            new NavigationMenu('My Animations', 'my-animations', 'movie', function (auth) { return auth.isAuthorized('user'); }),
            new NavigationMenu('Administration', 'admin', 'assignment_ind', function (auth) { return auth.isAuthorized('administrator'); })
        ];
        return NavigationMenu;
    }());
    GrafikaApp.NavigationMenu = NavigationMenu;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=navigation-menu.js.map