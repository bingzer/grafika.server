var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function () {
        function AnimationDetailController($stateParams, appCommon, animationService, frameService, authService) {
            var _this = this;
            this.canEdit = false;
            animationService.get($stateParams['_id']).then(function (res) {
                _this.animation = res.data;
                _this.canEdit = authService.getUser()._id === _this.animation.userId;
            });
        }
        AnimationDetailController.$inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService',
            'authService'
        ];
        return AnimationDetailController;
    }());
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=detail.js.map