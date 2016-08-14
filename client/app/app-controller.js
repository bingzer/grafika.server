var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AppController = (function (_super) {
        __extends(AppController, _super);
        function AppController(appCommon, authService, uxService, $rootScope) {
            var _this = this;
            _super.call(this, appCommon, authService);
            this.uxService = uxService;
            this.version = '';
            this.version = appCommon.appConfig.appVersion;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.roles) {
                    var user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)) {
                        _this.appCommon.navigateHome();
                    }
                }
                _this.uxService.pageTitle = _this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    _this.uxService.pageTitle = toState.data.pageTitle;
                }
            });
        }
        AppController.$inject = ['appCommon', 'authService', 'uxService', '$rootScope'];
        return AppController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AppController = AppController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-controller.js.map