var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationPlaybackController = (function (_super) {
        __extends(AnimationPlaybackController, _super);
        function AnimationPlaybackController(appCommon, authService, animationService, frameService, resourceService, $scope) {
            var _this = _super.call(this, appCommon, authService, animationService, frameService, resourceService) || this;
            _this.$scope = $scope;
            _this.totalFrame = 0;
            _this.currentFrame = 0;
            _this.isPlaying = false;
            _this.animationName = 'loading...';
            return _this;
        }
        AnimationPlaybackController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.animationName = this.animation.name;
            if (!this.grafika)
                this.grafika = new Grafika();
            this.grafika.initialize('#canvas', this.getOptions(), this.animation);
            this.grafika.setCallback({ on: function (ev, obj) {
                    switch (ev) {
                        case Grafika.EVT_FRAME_CHANGED:
                            _this.currentFrame = parseInt(obj);
                            _this.$scope.$applyAsync('vm.currentFrame');
                            break;
                        case Grafika.EVT_PLAYING:
                            _this.isPlaying = obj;
                            _this.$scope.$applyAsync('vm.isPlaying');
                            break;
                    }
                } });
            return this.frameService.get(animation)
                .then(function (res) {
                _this.grafika.setFrames(res.data);
                _this.totalFrame = res.data.length;
                _this.currentFrame = 0;
                _this.animationService.incrementViewCount(animation);
                return _this.appCommon.$q.when(animation);
            })
                .catch(function (err) {
                _this.appCommon.alert(_this.appCommon.formatErrorMessage(err))
                    .then(function () { return _this.appCommon.navigateHome(); });
            });
        };
        AnimationPlaybackController.prototype.toggle = function () {
            this.grafika.animation.currentFrame = this.currentFrame;
            if (this.grafika.isPlaying())
                this.grafika.pause();
            else
                this.grafika.play();
        };
        AnimationPlaybackController.prototype.togglePlaybackLoop = function () {
            this.grafika.setOptions({ loop: !this.grafika.getOptions().loop });
        };
        AnimationPlaybackController.prototype.previousFrame = function () {
            this.grafika.previousFrame();
        };
        AnimationPlaybackController.prototype.nextFrame = function () {
            this.grafika.nextFrame();
        };
        AnimationPlaybackController.prototype.navigateToFrame = function () {
            this.grafika.navigateToFrame(this.currentFrame);
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
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/playback.js.map