var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var UserService = (function (_super) {
        __extends(UserService, _super);
        function UserService(appCommon, authService, apiService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.apiService = apiService;
        }
        UserService.prototype.list = function (paging) {
            return this.apiService.get('users');
        };
        UserService.prototype.get = function (_id) {
            return this.apiService.get('users/' + _id);
        };
        UserService.prototype.update = function (user) {
            return this.apiService.put('users/' + user._id, user);
        };
        UserService.prototype.checkAvailability = function (email, username) {
            return this.apiService.post("accounts/username-check", { email: email, username: username });
        };
        UserService.$inject = ['appCommon', 'authService', 'apiService'];
        return UserService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UserService = UserService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=user-service.js.map