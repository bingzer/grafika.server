var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationPlaybackController = (function (_super) {
        __extends(AnimationPlaybackController, _super);
        function AnimationPlaybackController(appCommon, authService, animationService, frameService, resourceService, $scope) {
            _super.call(this, appCommon, authService, animationService, frameService, resourceService);
            this.$scope = $scope;
            this.totalFrame = 0;
            this.currentFrame = 0;
            this.isPlaying = false;
            this.animationName = 'loading...';
        }
        AnimationPlaybackController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.animationName = this.animation.name;
            if (!this.grafika)
                this.grafika = new Grafika();
            this.grafika.initialize('#canvas', this.getOptions(), this.animation);
            this.grafika.setCallback({ on: function (ev, obj) {
                    switch (ev) {
                        case 'frameChanged':
                            _this.currentFrame = parseInt(obj);
                            _this.$scope.$applyAsync('vm.currentFrame');
                            break;
                        case 'playing':
                            _this.isPlaying = obj;
                            _this.$scope.$applyAsync('vm.isPlaying');
                            break;
                    }
                } });
            this.frameService.get(animation).then(function (res) {
                _this.grafika.setFrames(res.data);
                _this.totalFrame = res.data.length;
                _this.currentFrame = 0;
                _this.animationService.incrementViewCount(animation);
            });
        };
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
        AnimationPlaybackController.prototype.getOptions = function () {
            var opts = { useNavigationText: false, useCarbonCopy: false };
            var user = this.authService.getUser();
            if (user) {
                opts.loop = user.prefs.playbackLoop;
            }
            return opts;
        };
        AnimationPlaybackController.$inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService', '$scope'];
        return AnimationPlaybackController;
    }(GrafikaApp.BaseAnimationController));
    GrafikaApp.AnimationPlaybackController = AnimationPlaybackController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=playback.js.map