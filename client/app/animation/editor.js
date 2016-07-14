var GrafikaApp;
(function (GrafikaApp) {
    var AnimationEditorController = (function () {
        function AnimationEditorController($rootScope, $stateParams, animationService, frameService) {
            this.$rootScope = $rootScope;
            this.$stateParams = $stateParams;
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
            this.grafika.save();
            this.animationService.update(this.grafika.getAnimation());
            this.frameService.update(this.grafika.getAnimation(), this.grafika.getFrames());
        };
        AnimationEditorController.$inject = [
            '$rootScope',
            '$stateParams',
            'animationService',
            'frameService'
        ];
        return AnimationEditorController;
    }());
    GrafikaApp.AnimationEditorController = AnimationEditorController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=editor.js.map