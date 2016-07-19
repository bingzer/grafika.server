var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var ResetController = (function (_super) {
        __extends(ResetController, _super);
        function ResetController(appCommon, authService, hash, email) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.hash = hash;
            this.email = email;
            this.busy = false;
            this.done = false;
            this.title = 'Set Password';
            this.subtitle = 'Hi ' + email + ', please set your password';
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
            }).catch(function (res) {
                _this.message = _this.appCommon.formatErrorMessage(res);
                _this.closable = true;
            }).finally(function () {
                _this.busy = false;
                _this.done = true;
            });
        };
        ResetController.$inject = ['appCommon', 'authService', 'hash', 'email'];
        return ResetController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ResetController = ResetController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=reset.js.map