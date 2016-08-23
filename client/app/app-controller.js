var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AppController = (function (_super) {
        __extends(AppController, _super);
        function AppController(appCommon, apiService, authService, uxService, $rootScope) {
            var _this = this;
            _super.call(this, appCommon, authService);
            this.apiService = apiService;
            this.uxService = uxService;
            this.version = '';
            this.buildTimestamp = '';
            this.feedback = new GrafikaApp.Feedback();
            this.feedbackCategories = ['Just saying Hi!', 'Bug', 'Features', 'Other'];
            this.version = appCommon.appConfig.appVersion;
            this.buildTimestamp = appCommon.appConfig.appBuildTimestamp;
            this.appCommon.appConfig.baseUrl = this.appCommon.getBaseUrl();
            this.authService.authenticate(true);
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.roles) {
                    var user = authService.getUser();
                    if (!user || !user.hasRoles(toState.data.roles)) {
                        _this.appCommon.navigateHome();
                    }
                }
                _this.uxService.pageTitle = _this.appCommon.appConfig.appTitle;
                if (toState.data && toState.data.pageTitle) {
                    _this.uxService.pageTitle = toState.data.pageTitle;
                }
            });
        }
        AppController.prototype.sendFeedback = function () {
            var _this = this;
            this.apiService.post('content/feedback', this.feedback)
                .then(function (res) {
                _this.appCommon.toast('Feedback is submitted!');
                return _this.appCommon.$q.when(true);
            })
                .finally(function () { return _this.feedback = new GrafikaApp.Feedback(); });
        };
        AppController.$inject = ['appCommon', 'apiService', 'authService', 'uxService', '$rootScope'];
        return AppController;
    }(GrafikaApp.AuthController));
    GrafikaApp.AppController = AppController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-controller.js.map