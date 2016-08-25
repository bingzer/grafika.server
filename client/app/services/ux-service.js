var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var UxService = (function (_super) {
        __extends(UxService, _super);
        function UxService(appCommon, authService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.pageTitle = appCommon.appConfig.appTitle;
        }
        UxService.prototype.isAuthenticated = function () {
            return this.authService.isAuthenticated();
        };
        UxService.prototype.isAuthorized = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        UxService.prototype.getUser = function () {
            return this.authService.getUser();
        };
        UxService.prototype.getNavigationMenus = function (type) {
            return GrafikaApp.NavigationMenu.getMenus(this, type);
        };
        UxService.prototype.openSideNav = function () {
            this.appCommon.$mdSidenav('left').open();
        };
        UxService.prototype.closeSidenav = function () {
            this.appCommon.$mdSidenav('left').close();
        };
        UxService.$inject = ['appCommon', 'authService'];
        return UxService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UxService = UxService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=ux-service.js.map