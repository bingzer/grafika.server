var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AdminController = (function (_super) {
        __extends(AdminController, _super);
        function AdminController(appCommon, authService, animationService, adminService) {
            _super.call(this, appCommon, authService);
            this.animationService = animationService;
            this.adminService = adminService;
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.configQuery = "";
            this.userQuery = "";
            this.animPaging = new GrafikaApp.QueryablePaging();
            this.animations = [];
            this.hasMoreAnims = true;
            this.userPaging = new GrafikaApp.QueryablePaging();
            this.users = [];
            this.busy = false;
        }
        AdminController.prototype.fetchServerInfo = function () {
            var _this = this;
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.adminService.getServerInfo().then(function (result) {
                _this.pushObject(_this.serverConfigs, null, result.data);
                _this.pushObject(_this.clientConfigs, null, _this.appCommon.appConfig);
            });
        };
        AdminController.prototype.fetchAnimations = function (append) {
            var _this = this;
            if (!append)
                this.animPaging.skip = 0;
            this.busy = true;
            this.adminService.listAnimations(this.animPaging)
                .then(function (result) { return _this.animationService.injectThumbnailUrl(result); })
                .then(function (res) {
                var anims = res.data;
                if (!append)
                    _this.animations = anims;
                else
                    _this.animations = _this.animations.concat(anims);
                _this.busy = false;
                _this.hasMoreAnims = anims.length >= _this.animPaging.limit;
                if (_this.hasMoreAnims)
                    _this.animPaging = _this.animPaging.next();
            });
        };
        AdminController.prototype.fetchUsers = function () {
            var _this = this;
            this.adminService.listUsers(this.userPaging).then(function (result) {
                _this.users = result.data;
            });
        };
        AdminController.prototype.canEdit = function () {
            return true;
        };
        AdminController.prototype.canDelete = function () {
            return true;
        };
        AdminController.prototype.confirmUserVerification = function (user) {
            var _this = this;
            this.appCommon.confirm('Send verification email to ' + user.email + '?')
                .then(function () { return _this.adminService.sendVerificationEmail(user); })
                .then(function () { return _this.appCommon.toast('Verification email sent to ' + user.email); });
        };
        ;
        AdminController.prototype.confirmUserPasswordReset = function (user) {
            var _this = this;
            this.appCommon.confirm('Send reset password email to ' + user.email + '?')
                .then(function () { return _this.adminService.sendResetPasswordEmail(user); })
                .then(function () { return _this.appCommon.toast('Reset password email sent to ' + user.email); });
        };
        ;
        AdminController.prototype.confirmDeactivate = function (user) {
            var _this = this;
            this.appCommon.confirm('Inactivate ' + user.email + '?')
                .then(function () { return _this.adminService.inactivateUser(user); })
                .then(function () {
                _this.fetchUsers();
                _this.appCommon.toast('User is inactivated');
                return _this.appCommon.$q.when(true);
            });
        };
        ;
        AdminController.prototype.confirmActivate = function (user) {
            var _this = this;
            this.appCommon.confirm('Activate ' + user.email + '?')
                .then(function () { return _this.adminService.activateUser(user); })
                .then(function () {
                _this.fetchUsers();
                _this.appCommon.toast('User is activated');
                return _this.appCommon.$q.when(true);
            });
        };
        ;
        AdminController.prototype.pushObject = function (configs, parentName, obj) {
            var _this = this;
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (angular.isArray(value)) {
                    configs.push({ key: parentName ? parentName + '.' + key : key, value: JSON.stringify(value, null, ' ') });
                }
                else if (angular.isObject(value)) {
                    _this.pushObject(configs, parentName ? parentName + '.' + key : key, value);
                }
                else {
                    configs.push({ key: parentName ? parentName + '.' + key : key, value: value });
                }
            });
        };
        AdminController.$inject = ['appCommon', 'authService', 'animationService', 'adminService'];
        return AdminController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AdminController = AdminController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=admin.js.map