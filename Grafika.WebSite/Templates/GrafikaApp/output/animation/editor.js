var GrafikaApp;
(function (GrafikaApp) {
    var AnimationEditorController = (function () {
        function AnimationEditorController($rootScope, $stateParams, appCommon, animationService, frameService, resourceService) {
            this.$rootScope = $rootScope;
            this.$stateParams = $stateParams;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.frameService = frameService;
            this.resourceService = resourceService;
            this.grafika = new Grafika();
            this.load();
        }
        AnimationEditorController.prototype.load = function () {
            var _this = this;
            this.animationService.get(this.$stateParams['_id']).then(function (res) {
                var anim = res.data;
                _this.appCommon.elem('#canvas-container').css('width', anim.width).css('height', anim.height);
                _this.grafika.initialize('#canvas', { drawingMode: 'paint' }, anim);
                _this.frameService.get(_this.grafika.getAnimation()).then(function (res) {
                    _this.grafika.setFrames(res.data);
                });
            });
        };
        AnimationEditorController.prototype.save = function () {
            var _this = this;
            this.grafika.save();
            var animation = this.grafika.getAnimation();
            this.animationService.update(animation)
                .then(function (res) { return _this.resourceService.saveThumbnail(animation); })
                .then(function (res) { return _this.resourceService.upload(res.data, _this.grafika.exts.getCanvasBlob()); })
                .then(function (res) { return _this.appCommon.toast('Successfully saved!'); });
        };
        return AnimationEditorController;
    }());
    AnimationEditorController.$inject = [
        '$rootScope',
        '$stateParams',
        'appCommon',
        'animationService',
        'frameService',
        'resourceService'
    ];
    GrafikaApp.AnimationEditorController = AnimationEditorController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/editor.js.map