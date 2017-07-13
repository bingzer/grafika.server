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
    var UserService = (function (_super) {
        __extends(UserService, _super);
        function UserService(appCommon, authService, apiService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            return _this;
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
        UserService.prototype.upload = function (data, blob) {
            if (!data.mime || !data.signedUrl)
                throw new Error('Expecting data.mime && data.signedUrl');
            var req = {
                method: 'PUT',
                url: data.signedUrl,
                cors: true,
                headers: {
                    'Authorization': undefined,
                    'Content-Type': data.mime,
                    'x-amz-acl': 'public-read'
                },
                data: blob
            };
            return this.apiService.$http(req);
        };
        UserService.prototype.saveAvatar = function (user, mime) {
            return this.apiService.post('users/' + user._id + '/avatar', { imageType: 'avatar', mime: mime });
        };
        UserService.prototype.checkAvailability = function (email, username) {
            return this.apiService.post("accounts/username-check", { email: email, username: username });
        };
        UserService.$inject = ['appCommon', 'authService', 'apiService'];
        return UserService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UserService = UserService;
})(GrafikaApp || (GrafikaApp = {}));
