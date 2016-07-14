var GrafikaApp;
(function (GrafikaApp) {
    var MyAnimationsController = (function () {
        function MyAnimationsController($rootScope, $mdDialog, animationService, authService) {
            this.$rootScope = $rootScope;
            this.$mdDialog = $mdDialog;
            this.animationService = animationService;
            this.authService = authService;
            this.list();
        }
        MyAnimationsController.prototype.list = function () {
            var paging = this.animationService.createPaging();
            paging.userId = this.authService.getUser()._id;
            this.animationService.list(paging).then(function (res) {
                this.animations = res.data;
            });
        };
        MyAnimationsController.prototype.create = function (ev) {
            var useFullScreen = false;
            this.$mdDialog.show({
                controller: 'AnimationCreateController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                templateUrl: '/app/animation/create.html',
                clickOutsideToClose: true,
                targetEvent: ev
            }).then(function (answer) {
            }, function () {
            });
        };
        MyAnimationsController.$inject = [
            '$rootScope',
            '$mdDialog',
            'animationService',
            'authService'
        ];
        return MyAnimationsController;
    }());
    GrafikaApp.MyAnimationsController = MyAnimationsController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=mine.js.map