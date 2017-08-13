var GrafikaApp;
(function (GrafikaApp) {
    var Player = (function () {
        function Player(baseApiUrl, canvasElementId) {
            this.grafika = new Grafika();
            this.baseApiUrl = baseApiUrl;
            this.grafika.initialize(canvasElementId, { debugMode: true, useCarbonCopy: false, useNavigationText: false, loop: true });
            if (this.baseApiUrl.charAt(this.baseApiUrl.length) == "/")
                this.baseApiUrl = this.baseApiUrl.substring(0, this.baseApiUrl.length - 1);
        }
        Player.prototype.togglePlay = function () {
            if (this.grafika.isPlaying()) {
                return this.pause();
            }
            else {
                return this.play();
            }
        };
        ;
        Player.prototype.play = function () {
            this.grafika.play();
            return jQuery.when({ isPlaying: this.grafika.isPlaying() });
        };
        Player.prototype.pause = function () {
            this.grafika.pause();
            return jQuery.when({ isPlaying: this.grafika.isPlaying() });
        };
        Player.prototype.loadAnimation = function (animationId) {
            var _this = this;
            var animUrl = this.baseApiUrl + "/animations/" + animationId;
            var qAnim = $.ajax({ url: "" + animUrl });
            var qFrames = $.ajax({ url: animUrl + "/frames" });
            return jQuery.when(qAnim, qFrames).done(function (resAnim, resFrames) {
                _this.grafika.setAnimation(resAnim[0]);
                _this.grafika.setFrames(resFrames[0]);
                return jQuery.when(0);
            });
        };
        Player.prototype.destroy = function () {
            this.grafika.destroy();
        };
        return Player;
    }());
    GrafikaApp.Player = Player;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/GrafikaApp.Player.js.map