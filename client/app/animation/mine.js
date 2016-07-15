var GrafikaApp;
(function (GrafikaApp) {
    var MyAnimationsController = (function () {
        function MyAnimationsController($rootScope, $mdDialog, appCommon, animationService, authService) {
            this.$rootScope = $rootScope;
            this.$mdDialog = $mdDialog;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.authService = authService;
            this.list();
        }
        MyAnimationsController.prototype.list = function () {
            var _this = this;
            var paging = new GrafikaApp.Paging({ isPublic: false, userId: this.authService.getUser()._id });
            this.animationService.list(paging).then(function (res) {
                _this.animations = res.data;
            });
        };
        MyAnimationsController.prototype.create = function (ev) {
            var _this = this;
            var useFullScreen = false;
            this.$mdDialog.show({
                controller: 'AnimationCreateController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                templateUrl: '/app/animation/create.html',
                clickOutsideToClose: true,
                targetEvent: ev
            }).then(function (answer) {
                _this.appCommon.toast('Animation is created');
            });
        };
        MyAnimationsController.$inject = [
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'animationService',
            'authService'
        ];
        return MyAnimationsController;
    }());
    GrafikaApp.MyAnimationsController = MyAnimationsController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=mine.js.map