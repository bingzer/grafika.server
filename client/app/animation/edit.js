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
            _super.call(this, appCommon);
            this.animationService = animationService;
            this.load();
        }
        AnimationEditController.prototype.load = function () {
            var _this = this;
            this.animationService.get(this.appCommon.$stateParams['_id']).then(function (res) {
                _this.animation = res.data;
            });
        };
        AnimationEditController.prototype.save = function () {
            var _this = this;
            this.animationService.update(this.animation).then(function (res) {
                _this.close().then(function () { return _this.appCommon.toast('Saved'); });
            });
        };
        AnimationEditController.$inject = ['appCommon', 'animationService'];
        return AnimationEditController;
    }(GrafikaApp.DialogController));
    GrafikaApp.AnimationEditController = AnimationEditController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=edit.js.map