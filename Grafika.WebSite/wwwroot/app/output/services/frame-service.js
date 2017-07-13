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
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            return _this;
        }
        FrameService.prototype.get = function (animation) {
            return this.apiService.get('animations/' + animation._id + '/frames');
        };
        FrameService.prototype.update = function (animation, data) {
            return this.apiService.post('animations/' + animation._id + '/frames', data);
        };
        return FrameService;
    }(GrafikaApp.BaseService));
    FrameService.$inject = ['appCommon', 'authService', 'apiService'];
    GrafikaApp.FrameService = FrameService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/services/frame-service.js.map