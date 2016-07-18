var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var ForgetController = (function (_super) {
        __extends(ForgetController, _super);
        function ForgetController(appCommon) {
            _super.call(this, appCommon);
        }
        ForgetController.$inject = ['appCommon'];
        return ForgetController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ForgetController = ForgetController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=forget.js.map