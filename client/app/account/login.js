var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var LoginController = (function (_super) {
        __extends(LoginController, _super);
        function LoginController(appCommon, authService) {
            _super.call(this, appCommon, authService);
        }
        LoginController.prototype.register = function () {
            return this.appCommon.showDialog('RegisterController', 'app/account/register.html');
        };
        LoginController.prototype.login = function (provider) {
            var _this = this;
            var loginProvider = provider;
            this.appCommon.showLoadingModal().then(function () { return _this.authService.login({ username: _this.username, password: _this.password }, provider); })
                .then(function (res) {
                if (!loginProvider)
                    _this.appCommon.navigateHome();
                else
                    _this.appCommon.toast('Connecting to ' + loginProvider);
            })
                .catch(function (res) {
                _this.appCommon.toastError(res);
                return _this.appCommon.$q.when(true);
            })
                .finally(function () {
                _this.appCommon.hideLoadingModal();
                _this.reset();
            });
        };
        LoginController.prototype.forgetPassword = function (evt) {
            this.appCommon.showDialog('app/account/forget.html', 'ForgetController', evt);
        };
        LoginController.prototype.reset = function () {
            this.username = '';
            this.password = '';
            this.close();
        };
        LoginController.prototype.close = function () {
            this.appCommon.$mdDialog.hide();
        };
        LoginController.$inject = ['appCommon', 'authService'];
        return LoginController;
    }(GrafikaApp.AuthController));
    GrafikaApp.LoginController = LoginController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=login.js.map