var GrafikaApp;
(function (GrafikaApp) {
    var AnimationPlaybackController = (function () {
        function AnimationPlaybackController($stateParams, appCommon, animationService, frameService) {
            var _this = this;
            this.$stateParams = $stateParams;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.frameService = frameService;
            this.totalFrame = 0;
            this.currentFrame = 0;
            this.isPlaying = false;
            this.animationName = 'loading...';
            this.grafika = new Grafika();
            var controller = this;
            this.animationService.get(this.$stateParams['_id']).then(function (res) {
                _this.animationName = res.data.name;
                _this.appCommon.elem('#canvas-container').css('width', res.data.width).css('height', res.data.height);
                _this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
                _this.grafika.setCallback({ on: function (ev, obj) {
                        switch (ev) {
                            case 'frameChanged':
                                controller.currentFrame = obj;
                                break;
                            case 'playing':
                                controller.isPlaying = obj;
                                break;
                        }
                    } });
                _this.frameService.get(_this.grafika.getAnimation()).then(function (res) {
                    _this.grafika.setFrames(res.data);
                    _this.totalFrame = res.data.length;
                    _this.currentFrame = 0;
                });
            });
        }
        AnimationPlaybackController.prototype.toggle = function () {
            if (this.grafika.isPlaying())
                this.grafika.pause();
            else
                this.grafika.play();
        };
        AnimationPlaybackController.prototype.previousFrame = function () {
            this.grafika.previousFrame();
        };
        AnimationPlaybackController.prototype.nextFrame = function () {
            this.grafika.nextFrame();
        };
        AnimationPlaybackController.$inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService'
        ];
        return AnimationPlaybackController;
    }());
    GrafikaApp.AnimationPlaybackController = AnimationPlaybackController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=playback.js.map