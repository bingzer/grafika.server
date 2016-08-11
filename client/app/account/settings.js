var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var SettingsController = (function (_super) {
        __extends(SettingsController, _super);
        function SettingsController(appCommon, authService, userService) {
            var _this = this;
            _super.call(this, appCommon);
            this.authService = authService;
            this.userService = userService;
            this.userService.get(this.authService.getUser()._id).then(function (res) {
                _this.user = res.data;
            });
        }
        SettingsController.prototype.save = function () {
            var _this = this;
            this.userService.update(this.user)
                .then(function () {
                _this.needsUpdate = false;
                _this.appCommon.toast('Saved!');
                return _this.authService.authenticate();
            })
                .catch(function (err) { return _this.appCommon.toastError(err); });
        };
        SettingsController.$inject = ['appCommon', 'authService', 'userService'];
        return SettingsController;
    }(GrafikaApp.DialogController));
    GrafikaApp.SettingsController = SettingsController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=settings.js.map