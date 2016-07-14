var GrafikaApp;
(function (GrafikaApp) {
    var LoginController = (function () {
        function LoginController($mdDialog, appCommon, authService) {
            this.$mdDialog = $mdDialog;
            this.appCommon = appCommon;
            this.authService = authService;
        }
        LoginController.prototype.register = function () {
            this.appCommon.$mdDialog.show({
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'app/account/register.html'
            });
        };
        LoginController.prototype.login = function (provider) {
            var _this = this;
            var loginProvider = provider;
            this.appCommon.showLoadingModal().then(function () {
                return _this.authService.login({ username: _this.username, password: _this.password }, provider);
            })
                .then(function (res) {
                if (!loginProvider)
                    _this.appCommon.navigateHome();
                else
                    _this.appCommon.toast('Connecting to ' + loginProvider);
            })
                .then(function () {
                return _this.appCommon.hideLoadingModal();
            })
                .finally(function () {
                _this.reset();
            });
        };
        LoginController.prototype.reset = function () {
            this.username = '';
            this.password = '';
        };
        LoginController.$inject = [
            '$mdDialog',
            'appCommon',
            'authService'
        ];
        return LoginController;
    }());
    GrafikaApp.LoginController = LoginController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=login.js.map