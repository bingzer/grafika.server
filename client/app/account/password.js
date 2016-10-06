var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var PasswordController = (function (_super) {
        __extends(PasswordController, _super);
        function PasswordController(appCommon, authService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.requireCurrentPassword = true;
            this.busy = false;
            this.done = false;
            this.title = 'Set Password';
            this.closable = true;
            this.requireCurrentPassword = authService.getUser().local.registered;
        }
        PasswordController.prototype.changePassword = function () {
            var _this = this;
            this.busy = true;
            var pwd = { currPwd: this.currentPassword, newPwd: this.newPassword };
            this.authService.changePassword(pwd).then(function (res) {
                _this.appCommon.toast('Password is sucessfully changed');
                _this.close();
            }).catch(function (res) {
                _this.message = _this.appCommon.formatErrorMessage(res);
            }).finally(function () {
                _this.busy = false;
                _this.closable = true;
            });
        };
        PasswordController.$inject = ['appCommon', 'authService'];
        return PasswordController;
    }(GrafikaApp.DialogController));
    GrafikaApp.PasswordController = PasswordController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=password.js.map