var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var UxService = (function (_super) {
        __extends(UxService, _super);
        function UxService(appCommon) {
            _super.call(this, appCommon);
            this.pageTitle = appCommon.appConfig.appTitle;
        }
        UxService.$inject = ['appCommon'];
        return UxService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UxService = UxService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=ux-service.js.map