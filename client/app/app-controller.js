var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AppController = (function (_super) {
        __extends(AppController, _super);
        function AppController(appCommon, authService, uxService) {
            _super.call(this, appCommon, authService);
            this.uxService = uxService;
            this.version = '';
            this.authService.authenticate();
            this.version = appCommon.appConfig.appVersion;
        }
        AppController.$inject = ['appCommon', 'authService', 'uxService'];
        return AppController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AppController = AppController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-controller.js.map