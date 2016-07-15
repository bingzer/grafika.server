var GrafikaApp;
(function (GrafikaApp) {
    var AnimationEditorController = (function () {
        function AnimationEditorController($rootScope, $stateParams, appCommon, animationService, frameService) {
            this.$rootScope = $rootScope;
            this.$stateParams = $stateParams;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.frameService = frameService;
            this.grafika = new Grafika();
            this.load();
        }
        AnimationEditorController.prototype.load = function () {
            var _this = this;
            this.animationService.get(this.$stateParams['_id']).then(function (res) {
                _this.grafika.initialize('#canvas', { drawingMode: 'paint' }, res.data);
                _this.frameService.get(_this.grafika.getAnimation()).then(function (res) {
                    _this.grafika.setFrames(res.data);
                });
            });
        };
        AnimationEditorController.prototype.save = function () {
            var _this = this;
            this.grafika.save();
            this.animationService.update(this.grafika.getAnimation()).then(function (res) {
                _this.appCommon.toast('Saved!');
            });
        };
        AnimationEditorController.$inject = [
            '$rootScope',
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService'
        ];
        return AnimationEditorController;
    }());
    GrafikaApp.AnimationEditorController = AnimationEditorController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=editor.js.map