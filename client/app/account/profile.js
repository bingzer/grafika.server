var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var ProfileController = (function (_super) {
        __extends(ProfileController, _super);
        function ProfileController(appCommon, authService, userService) {
            var _this = this;
            _super.call(this, appCommon);
            this.authService = authService;
            this.userService = userService;
            this.userService.get(this.authService.getUser()._id).then(function (res) {
                _this.user = res.data;
            });
        }
        ProfileController.prototype.changePassword = function (event) {
            this.appCommon.showDialog("PasswordController", "app/account/reset.html", event);
        };
        ProfileController.prototype.checkUsernameAvailability = function () {
            var _this = this;
            this.userService.checkAvailability(this.user.email, this.user.username)
                .then(function () { return _this.appCommon.toast(_this.user.username + ' is available'); })
                .catch(function (err) { return _this.appCommon.toastError(err); });
        };
        ProfileController.prototype.save = function () {
            var _this = this;
            this.userService.update(this.user)
                .then(function () {
                _this.needsUpdate = false;
                _this.appCommon.toast('Saved!');
                return _this.authService.authenticate();
            })
                .catch(function (err) { return _this.appCommon.toastError(err); });
        };
        ProfileController.prototype.uploadAvatar = function ($imageData) {
            var avatar = { name: $imageData.name, size: $imageData.size, mime: $imageData.mime };
            return this.appCommon.$q.when(true);
        };
        ProfileController.$inject = ['appCommon', 'authService', 'userService'];
        return ProfileController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ProfileController = ProfileController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=profile.js.map