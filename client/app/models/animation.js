var GrafikaApp;
(function (GrafikaApp) {
    var Animation = (function () {
        function Animation() {
        }
        Animation.prototype.setFrames = function (frames) {
            return this.frames = frames;
        };
        return Animation;
    }());
    GrafikaApp.Animation = Animation;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=animation.js.map