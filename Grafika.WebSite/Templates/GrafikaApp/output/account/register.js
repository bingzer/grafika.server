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
    var RegisterController = (function (_super) {
        __extends(RegisterController, _super);
        function RegisterController(appCommon, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.message = 'After signing up, you will receive email to activate your account.';
            _this.name = '';
            _this.email = '';
            _this.busy = false;
            _this.done = false;
            return _this;
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
        return RegisterController;
    }(GrafikaApp.DialogController));
    RegisterController.$inject = ['appCommon', 'authService'];
    GrafikaApp.RegisterController = RegisterController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/account/register.js.map