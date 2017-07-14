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
    var PasswordController = (function (_super) {
        __extends(PasswordController, _super);
        function PasswordController(appCommon, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.requireCurrentPassword = true;
            _this.busy = false;
            _this.done = false;
            _this.isPasswordValid = false;
            _this.title = 'Set Password';
            _this.closable = true;
            _this.requireCurrentPassword = (authService.getUser().local ? authService.getUser().local.registered : false);
            _this.validator = new GrafikaApp.PasswordValidator();
            _this.validatePassword();
            return _this;
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
        PasswordController.prototype.validatePassword = function () {
            this.message = this.validator.validatePassword(this.newPassword);
            this.isPasswordValid = this.message.length == 0;
        };
        return PasswordController;
    }(GrafikaApp.DialogController));
    PasswordController.$inject = ['appCommon', 'authService'];
    GrafikaApp.PasswordController = PasswordController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/account/password.js.map