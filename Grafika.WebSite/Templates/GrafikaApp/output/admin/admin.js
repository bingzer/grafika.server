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
    var AdminController = (function (_super) {
        __extends(AdminController, _super);
        function AdminController(appCommon, authService, animationService, adminService) {
            var _this = _super.call(this, appCommon, authService) || this;
            _this.animationService = animationService;
            _this.adminService = adminService;
            _this.serverConfigs = [];
            _this.clientConfigs = [];
            _this.configQuery = "";
            _this.userQuery = "";
            _this.animPaging = new GrafikaApp.Paging();
            _this.animations = [];
            _this.hasMoreAnims = true;
            _this.userPaging = new GrafikaApp.Paging();
            _this.users = [];
            _this.hasMoreUsers = true;
            _this.busy = false;
            _this.userPaging.sort = "-lastSeen";
            return _this;
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
                .then(function (result) { return _this.animationService.injectResources(result); })
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
        AdminController.prototype.fetchUsers = function (append) {
            var _this = this;
            if (!append)
                this.userPaging.skip = 0;
            this.adminService.listUsers(this.userPaging)
                .then(function (results) {
                results.data.forEach(function (u) {
                    var user = u;
                    if (user.stats && user.stats.dateLastSeen)
                        user.dateLastSeenDisplay = new Date(user.stats.dateLastSeen).toLocaleDateString();
                    user.dateCreatedDisplay = new Date(u.dateModified).toLocaleDateString();
                    user.dateModifiedDisplay = new Date(u.dateCreated).toLocaleDateString();
                });
                return results;
            })
                .then(function (results) {
                var users = results.data;
                if (!append)
                    _this.users = users;
                else
                    _this.users = _this.users.concat(users);
                _this.busy = false;
                _this.hasMoreUsers = users.length >= _this.userPaging.limit;
                if (_this.hasMoreUsers)
                    _this.userPaging = _this.userPaging.next();
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/admin/admin.js.map