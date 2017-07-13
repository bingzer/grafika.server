var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationEditController = (function (_super) {
        __extends(AnimationEditController, _super);
        function AnimationEditController(appCommon, animationService) {
            var _this = _super.call(this, appCommon) || this;
            _this.animationService = animationService;
            _this.load();
            return _this;
        }
        AnimationEditController.prototype.load = function () {
            var _this = this;
            this.animationService.get(this.appCommon.$stateParams['_id']).then(function (res) {
                _this.animation = res.data;
            });
        };
        AnimationEditController.prototype.save = function () {
            var _this = this;
            this.animation.dateModified = Date.now();
            this.animationService.update(this.animation).then(function (res) {
                _this.close().then(function () { return _this.appCommon.toast('Saved'); });
            });
        };
        return AnimationEditController;
    }(GrafikaApp.DialogController));
    AnimationEditController.$inject = ['appCommon', 'animationService'];
    GrafikaApp.AnimationEditController = AnimationEditController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/edit.js.map