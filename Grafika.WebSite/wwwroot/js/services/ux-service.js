var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var UxService = (function (_super) {
        __extends(UxService, _super);
        function UxService(appCommon, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.pageTitle = appCommon.appConfig.appTitle;
            return _this;
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
            this.appCommon.$mdSidenav('left', true).then(function (result) { return result.open(); });
        };
        UxService.prototype.closeSidenav = function () {
            try {
                this.appCommon.$mdSidenav('left', true).then(function (result) { return result.close(); });
            }
            catch (e) {
                // ignore
            }
        };
        UxService.$inject = ['appCommon', 'authService'];
        return UxService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UxService = UxService;
})(GrafikaApp || (GrafikaApp = {}));
