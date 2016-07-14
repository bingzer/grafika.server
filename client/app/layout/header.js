var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var HeaderController = (function (_super) {
        __extends(HeaderController, _super);
        function HeaderController(appCommon, authService) {
            _super.call(this, appCommon, authService);
        }
        return HeaderController;
    }(GrafikaApp.LayoutController));
    GrafikaApp.HeaderController = HeaderController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=header.js.map