var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function () {
        function AnimationDetailController($stateParams, appCommon, animationService, frameService) {
            var _this = this;
            animationService.get($stateParams['_id']).then(function (res) {
                _this.animation = res.data;
            });
        }
        AnimationDetailController.$inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService'
        ];
        return AnimationDetailController;
    }());
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=detail.js.map