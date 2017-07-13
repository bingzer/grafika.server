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
    var ResetController = (function (_super) {
        __extends(ResetController, _super);
        function ResetController(appCommon, authService, hash, email) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.hash = hash;
            _this.email = email;
            _this.busy = false;
            _this.done = false;
            _this.isPasswordValid = false;
            _this.validator = new GrafikaApp.PasswordValidator();
            _this.title = 'Set Password';
            _this.subtitle = 'Hi ' + email + ', please set your password';
            _this.validatePassword();
            return _this;
        }
        ResetController.prototype.changePassword = function () {
            var _this = this;
            this.busy = true;
            var user = {
                hash: this.hash,
                username: this.email,
                password: this.newPassword
            };
            this.authService.register(user).then(function (res) {
                _this.appCommon.toast('Password is sucessfully set, please re-login');
                _this.close();
            })["catch"](function (res) {
                _this.message = _this.appCommon.formatErrorMessage(res);
                _this.closable = true;
            })["finally"](function () {
                _this.busy = false;
                _this.done = true;
            });
        };
        ResetController.prototype.validatePassword = function () {
            this.message = this.validator.validatePassword(this.newPassword);
            this.isPasswordValid = this.message.length == 0;
        };
        ResetController.$inject = ['appCommon', 'authService', 'hash', 'email'];
        return ResetController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ResetController = ResetController;
})(GrafikaApp || (GrafikaApp = {}));
