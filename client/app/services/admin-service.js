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
            _super.call(this, appCommon);
            this.authService = authService;
            this.apiService = apiService;
        }
        AdminService.prototype.getServerInfo = function () {
            return this.apiService.get('admin');
        };
        AdminService.prototype.listUsers = function (paging) {
            return this.apiService.get('admin/users' + paging.toQueryString());
        };
        AdminService.prototype.listAnimations = function (paging) {
            return this.apiService.get('admin/animations' + paging.toQueryString());
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
        AdminService.$inject = ['appCommon', 'authService', 'apiService'];
        return AdminService;
    }(GrafikaApp.BaseService));
    GrafikaApp.AdminService = AdminService;
    var AdminPaging = (function (_super) {
        __extends(AdminPaging, _super);
        function AdminPaging() {
            _super.apply(this, arguments);
        }
        AdminPaging.prototype.createSearchTerm = function (query) {
            return '&term=' + query;
        };
        return AdminPaging;
    }(GrafikaApp.Paging));
    GrafikaApp.AdminPaging = AdminPaging;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=admin-service.js.map