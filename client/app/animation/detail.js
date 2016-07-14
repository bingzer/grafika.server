var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function () {
        function AnimationDetailController($rootScope, $stateParams, animationService, frameService) {
            var _this = this;
            this.grafika = new Grafika();
            animationService.get($stateParams['_id']).then(function (res) {
                _this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
                frameService.get(_this.grafika.getAnimation()).then(function (res) {
                    _this.grafika.setFrames(res.data);
                });
            });
        }
        AnimationDetailController.$inject = [
            '$rootScope',
            '$stateParams',
            'animationService',
            'frameService'
        ];
        return AnimationDetailController;
    }());
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=detail.js.map