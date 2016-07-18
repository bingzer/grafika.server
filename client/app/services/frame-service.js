var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var FrameService = (function (_super) {
        __extends(FrameService, _super);
        function FrameService(appCommon, authService, apiService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.apiService = apiService;
        }
        FrameService.prototype.get = function (animation) {
            return this.apiService.get('animations/' + animation._id + '/frames');
        };
        FrameService.prototype.update = function (animation, data) {
            return this.apiService.post('animations/' + animation._id + '/frames', data);
        };
        FrameService.$inject = ['appCommon', 'authService', 'apiService'];
        return FrameService;
    }(GrafikaApp.BaseService));
    GrafikaApp.FrameService = FrameService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=frame-service.js.map