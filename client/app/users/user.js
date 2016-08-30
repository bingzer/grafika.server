var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var UserController = (function (_super) {
        __extends(UserController, _super);
        function UserController(appCommon, animationService, userService) {
            _super.call(this, appCommon);
            this.animationService = animationService;
            this.userService = userService;
            this.list();
        }
        UserController.prototype.list = function () {
            var _this = this;
            this.userService.get(this.appCommon.$stateParams['_id'])
                .then(function (res) {
                _this.user = new GrafikaApp.User(res.data);
                _this.loadAnimations();
            })
                .catch(function (err) {
                _this.appCommon.alert(_this.appCommon.formatErrorMessage(err))
                    .then(function () { return _this.appCommon.navigateHome(); });
            });
        };
        UserController.prototype.loadAnimations = function () {
            var _this = this;
            this.paging = new GrafikaApp.Paging({ userId: this.user._id, isPublic: true });
            this.animationService.list(this.paging).then(function (res) {
                _this.animations = res.data;
            });
        };
        UserController.$inject = ['appCommon', 'animationService', 'userService'];
        return UserController;
    }(GrafikaApp.BaseController));
    GrafikaApp.UserController = UserController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=user.js.map