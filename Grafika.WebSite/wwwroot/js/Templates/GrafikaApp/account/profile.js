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
    var ProfileController = (function (_super) {
        __extends(ProfileController, _super);
        function ProfileController(appCommon, authService, userService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.userService = userService;
            _this.userService.get(_this.authService.getUser()._id).then(function (res) {
                _this.user = res.data;
                _this.useGoogleAuth = angular.isDefined(_this.user.google);
                _this.useFacebookAuth = angular.isDefined(_this.user.facebook);
            });
            return _this;
        }
        ProfileController.prototype.changePassword = function (event) {
            this.appCommon.showDialog("app/account/reset.html", "PasswordController", event);
        };
        ProfileController.prototype.checkUsernameAvailability = function () {
            var _this = this;
            this.userService.checkAvailability(this.user.email, this.user.username)
                .then(function () { return _this.appCommon.toast(_this.user.username + ' is available'); })["catch"](function (err) { return _this.appCommon.toastError(err); });
        };
        ProfileController.prototype.save = function () {
            var _this = this;
            return this.userService.update(this.user)
                .then(function () {
                _this.needsUpdate = false;
                _this.appCommon.toast('Saved!');
                return _this.authService.authenticate();
            })["catch"](function (err) { return _this.appCommon.toastError(err); });
        };
        ProfileController.prototype.uploadAvatar = function (avatar) {
            var _this = this;
            return this.userService.saveAvatar(this.user, avatar.mime)
                .then(function (signedUrl) { return _this.userService.upload(signedUrl.data, avatar.getBlob()); })
                .then(function () {
                _this.user.prefs.avatar = "" + _this.appCommon.appConfig.userBaseUrl + _this.user._id + "/avatar";
                return _this.save();
            })["finally"](function () { return window.location.reload(true); });
        };
        ProfileController.$inject = ['appCommon', 'authService', 'userService'];
        return ProfileController;
    }(GrafikaApp.DialogController));
    GrafikaApp.ProfileController = ProfileController;
})(GrafikaApp || (GrafikaApp = {}));
