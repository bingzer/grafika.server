var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var ForgetController = (function (_super) {
        __extends(ForgetController, _super);
        function ForgetController(appCommon, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.busy = false;
            return _this;
        }
        ForgetController.prototype.sendForgetEmail = function () {
            var _this = this;
            this.busy = true;
            this.authService.resetPassword({ email: this.email }).then(function (res) {
                _this.appCommon.toast('Email sent');
                _this.close();
            }).catch(function (res) {
                _this.message = _this.appCommon.formatErrorMessage(res);
            }).finally(function () {
                _this.busy = false;
            });
        };
        return ForgetController;
    }(GrafikaApp.DialogController));
    ForgetController.$inject = ['appCommon', 'authService'];
    GrafikaApp.ForgetController = ForgetController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/account/forget.js.map