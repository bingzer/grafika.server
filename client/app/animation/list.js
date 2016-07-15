var GrafikaApp;
(function (GrafikaApp) {
    var AnimationListController = (function () {
        function AnimationListController($rootScope, animationService) {
            this.$rootScope = $rootScope;
            this.animationService = animationService;
            this.list();
        }
        AnimationListController.prototype.list = function () {
            var _this = this;
            this.animationService.list().then(function (res) {
                _this.animations = res.data;
            });
        };
        AnimationListController.$inject = [
            '$rootScope',
            'animationService'
        ];
        return AnimationListController;
    }());
    GrafikaApp.AnimationListController = AnimationListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=list.js.map