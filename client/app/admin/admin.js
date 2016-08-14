var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AdminController = (function (_super) {
        __extends(AdminController, _super);
        function AdminController(appCommon, authService, adminService) {
            _super.call(this, appCommon, authService);
            this.adminService = adminService;
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.configQuery = "";
            this.userQuery = "";
            this.animPaging = new GrafikaApp.AdminPaging();
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
        AdminController.prototype.fetchAnimations = function () {
            var _this = this;
            this.adminService.listAnimations(this.animPaging).then(function (result) {
                _this.animations = result.data;
            });
        };
        AdminController.prototype.canEdit = function () {
            return true;
        };
        AdminController.prototype.canDelete = function () {
            return true;
        };
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
        AdminController.$inject = ['appCommon', 'animationService', 'adminService'];
        return AdminController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AdminController = AdminController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=admin.js.map