var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var RegisterController = (function (_super) {
        __extends(RegisterController, _super);
        function RegisterController(appCommon, authService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.message = 'After signing up, you will receive email to activate your account.';
            this.name = '';
            this.email = '';
            this.busy = false;
            this.done = false;
        }
        RegisterController.prototype.register = function () {
            var _this = this;
            this.message = 'Sending verification email...';
            this.busy = true;
            this.authService.register({ name: this.name, username: this.email, password: 'fake-password' })
                .then(function (res) {
                if (res.status == 200)
                    _this.message = "Email has been sent";
                else
                    _this.handleError(res);
                _this.busy = false;
                _this.done = true;
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        };
        RegisterController.prototype.handleError = function (err) {
            this.message = this.appCommon.formatErrorMessage(err);
            this.busy = false;
        };
        RegisterController.$inject = ['appCommon', 'authService'];
        return RegisterController;
    }(GrafikaApp.DialogController));
    GrafikaApp.RegisterController = RegisterController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=register.js.map