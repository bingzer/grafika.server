var GrafikaApp;
(function (GrafikaApp) {
    var LayoutController = (function () {
        function LayoutController(appCommon, authService) {
            this.appCommon = appCommon;
            this.authService = authService;
            this.vm = this;
        }
        LayoutController.prototype.isAuthorize = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        LayoutController.prototype.getUser = function () {
            return this.authService.getUser();
        };
        LayoutController.prototype.confirmLogout = function () {
            var _this = this;
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(function () {
                return _this.appCommon.showLoadingModal();
            }).then(function () {
                return _this.authService.logout();
            })
                .then(function () {
                return _this.appCommon.hideLoadingModal();
            })
                .then(function () {
                return this.appCommon.toast('Successfully logged out');
            });
        };
        LayoutController.$inject = [
            'appCommon',
            'authService'
        ];
        return LayoutController;
    }());
    GrafikaApp.LayoutController = LayoutController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=layout.js.map