var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AdminService = (function (_super) {
        __extends(AdminService, _super);
        function AdminService(appCommon, authService, apiService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            return _this;
        }
        AdminService.prototype.getServerInfo = function () {
            return this.apiService.get('admin');
        };
        AdminService.prototype.listAnimations = function (paging) {
            return this.apiService.get('admin/animations' + paging.toQueryString());
        };
        AdminService.prototype.listUsers = function (paging) {
            return this.apiService.get('admin/users' + paging.toQueryString());
        };
        AdminService.prototype.sendVerificationEmail = function (user) {
            return this.apiService.post('admin/users/' + user._id + '/reverify');
        };
        AdminService.prototype.sendResetPasswordEmail = function (user) {
            return this.apiService.post('admin/users/' + user._id + '/reset-pwd');
        };
        AdminService.prototype.inactivateUser = function (user) {
            return this.apiService.post('admin/users/' + user._id + '/inactivate');
        };
        AdminService.prototype.activateUser = function (user) {
            return this.apiService.post('admin/users/' + user._id + '/activate');
        };
        return AdminService;
    }(GrafikaApp.BaseService));
    AdminService.$inject = ['appCommon', 'authService', 'apiService'];
    GrafikaApp.AdminService = AdminService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/services/admin-service.js.map