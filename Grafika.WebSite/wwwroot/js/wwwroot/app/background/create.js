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
    var BackgroundCreateController = (function (_super) {
        __extends(BackgroundCreateController, _super);
        function BackgroundCreateController(appCommon, authService, backgroundService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.backgroundService = backgroundService;
            _this.width = 800;
            _this.height = 450;
            _this.orientations = ['Landscape', 'Portrait'];
            _this.orientation = 'Landscape';
            _this.isPublic = _this.authService.getUser().prefs.drawingIsPublic;
            _this.width = _this.appCommon.appConfig.defaultAnimationWidth;
            _this.height = _this.appCommon.appConfig.defaultAnimationHeight;
            return _this;
        }
        BackgroundCreateController.prototype.create = function () {
            var _this = this;
            var background = {
                name: this.name,
                isPublic: this.isPublic
            };
            if (this.orientation === 'Landscape') {
                background.width = this.width;
                background.height = this.height;
            }
            else {
                background.width = this.height;
                background.height = this.width;
            }
            this.backgroundService.create(background).then(function (res) {
                _this.close();
                _this.appCommon.showLoadingModal().then(function () {
                    var background = res.data;
                    _this.appCommon.$state.go('drawing', { _id: background._id });
                });
            });
        };
        BackgroundCreateController.$inject = ['appCommon', 'authService', 'backgroundService'];
        return BackgroundCreateController;
    }(GrafikaApp.DialogController));
    GrafikaApp.BackgroundCreateController = BackgroundCreateController;
})(GrafikaApp || (GrafikaApp = {}));
