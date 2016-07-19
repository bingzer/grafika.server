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
        }
        Base.$inject = ['appCommon'];
        return Base;
    }());
    GrafikaApp.Base = Base;
    var BaseService = (function (_super) {
        __extends(BaseService, _super);
        function BaseService(appCommon) {
            _super.call(this, appCommon);
        }
        return BaseService;
    }(Base));
    GrafikaApp.BaseService = BaseService;
    var BaseController = (function (_super) {
        __extends(BaseController, _super);
        function BaseController(appCommon) {
            _super.call(this, appCommon);
        }
        return BaseController;
    }(Base));
    GrafikaApp.BaseController = BaseController;
    var AuthController = (function (_super) {
        __extends(AuthController, _super);
        function AuthController(appCommon, authService) {
            _super.call(this, appCommon);
            this.authService = authService;
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
        AuthController.$inject = ['appCommon', 'authService'];
        return AuthController;
    }(BaseController));
    GrafikaApp.AuthController = AuthController;
    var DialogController = (function (_super) {
        __extends(DialogController, _super);
        function DialogController(appCommon) {
            _super.call(this, appCommon);
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
//# sourceMappingURL=app-base.js.map