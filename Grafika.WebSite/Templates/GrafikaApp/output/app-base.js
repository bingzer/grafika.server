var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var Base = (function () {
        function Base(appCommon) {
            this.appCommon = appCommon;
            // nothing
        }
        return Base;
    }());
    Base.$inject = ['appCommon'];
    GrafikaApp.Base = Base;
    var BaseService = (function (_super) {
        __extends(BaseService, _super);
        function BaseService(appCommon) {
            return _super.call(this, appCommon) || this;
        }
        return BaseService;
    }(Base));
    GrafikaApp.BaseService = BaseService;
    /**
     * Base controller
     */
    var BaseController = (function (_super) {
        __extends(BaseController, _super);
        function BaseController(appCommon) {
            var _this = _super.call(this, appCommon) || this;
            _this.appCommon = appCommon;
            return _this;
        }
        return BaseController;
    }(Base));
    GrafikaApp.BaseController = BaseController;
    /**
     * Has auth stuffs
     */
    var AuthController = (function (_super) {
        __extends(AuthController, _super);
        function AuthController(appCommon, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            return _this;
        }
        AuthController.prototype.isAuthenticated = function () {
            return this.authService.isAuthenticated();
        };
        AuthController.prototype.isAuthorized = function (roles) {
            return this.authService.isAuthorized(roles);
        };
        AuthController.prototype.getUser = function () {
            return this.authService.getUser();
        };
        return AuthController;
    }(BaseController));
    AuthController.$inject = ['appCommon', 'authService'];
    GrafikaApp.AuthController = AuthController;
    /**
     * Dialog controller
     */
    var DialogController = (function (_super) {
        __extends(DialogController, _super);
        function DialogController(appCommon) {
            return _super.call(this, appCommon) || this;
        }
        DialogController.prototype.close = function (response) {
            return this.appCommon.$mdDialog.hide(response);
        };
        DialogController.prototype.cancel = function () {
            this.appCommon.$mdDialog.cancel();
        };
        return DialogController;
    }(BaseController));
    GrafikaApp.DialogController = DialogController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/app-base.js.map