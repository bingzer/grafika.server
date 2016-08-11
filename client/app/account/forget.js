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
            _super.call(this, appCommon);
            this.authService = authService;
            this.busy = false;
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
        ForgetController.$inject = ['appCommon', 'authService'];
        return ForgetController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ForgetController = ForgetController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=forget.js.map