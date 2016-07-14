var GrafikaApp;
(function (GrafikaApp) {
    var MainController = (function () {
        function MainController(appCommon, authService) {
            this.appCommon = appCommon;
            this.authService = authService;
            var query = appCommon.$location.search();
            if (query && query.action) {
                if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user) {
                    appCommon.$mdDialog.show({
                        controller: 'ResetController',
                        controllerAs: 'vm',
                        templateUrl: 'app/account/reset.html',
                        parent: angular.element(document.body),
                        locals: { hash: query.hash, email: query.user }
                    }).then(appCommon.navigateHome);
                    this.cleanUrlQueries();
                }
                else {
                    appCommon.alert('Unknown action or link has expired');
                    this.cleanUrlQueries();
                }
            }
        }
        MainController.prototype.isAuthorize = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        MainController.prototype.getUser = function () {
            return this.authService.getUser();
        };
        MainController.prototype.confirmLogout = function () {
            this.appCommon.confirm('Are you sure you want to log out?')
                .then(this.appCommon.showLoadingModal)
                .then(this.authService.logout)
                .then(this.appCommon.hideLoadingModal)
                .then(function () {
                this.appCommon.toast('Successfully logged out');
            });
        };
        MainController.prototype.cleanUrlQueries = function () {
            Object.keys(this.appCommon.$location.search()).forEach(function (key) {
                delete this.appCommon.$location.search()[key];
            });
        };
        MainController.$inject = [
            'appCommon',
            'authService'
        ];
        return MainController;
    }());
    GrafikaApp.MainController = MainController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=main.js.map