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
    var SettingsController = (function (_super) {
        __extends(SettingsController, _super);
        function SettingsController(appCommon, authService, userService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.userService = userService;
            _this.userService.get(_this.authService.getUser()._id).then(function (res) {
                _this.user = res.data;
            });
            return _this;
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