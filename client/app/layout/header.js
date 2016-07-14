var grafikaApp;
(function (grafikaApp) {
    var HeaderController = (function () {
        function HeaderController(appCommon, authService) {
            this.appCommon = appCommon;
            this.authService = authService;
        }
        HeaderController.prototype.isAuthorize = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        HeaderController.prototype.getUser = function () {
            return this.authService.getUser();
        };
        HeaderController.prototype.confirmLogout = function () {
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(this.appCommon.showLoadingModal)
                .then(this.authService.logout)
                .then(this.appCommon.hideLoadingModal)
                .then(function () {
                this.appCommon.toast('Successfully logged out');
            });
        };
        HeaderController.$inject = [
            'appCommon',
            'authService'
        ];
        return HeaderController;
    }());
    grafikaApp.HeaderController = HeaderController;
})(grafikaApp || (grafikaApp = {}));
//# sourceMappingURL=header.js.map