var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var UxService = (function (_super) {
        __extends(UxService, _super);
        function UxService(appCommon, $rootScope) {
            var _this = this;
            _super.call(this, appCommon);
            this.pageTitle = appCommon.appConfig.appTitle;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.pageTitle) {
                    _this.pageTitle = toState.data.pageTitle;
                    return;
                }
                _this.pageTitle = 'Grafika';
            });
        }
        UxService.$inject = ['appCommon', '$rootScope'];
        return UxService;
    }(GrafikaApp.BaseService));
    GrafikaApp.UxService = UxService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=ux-service.js.map