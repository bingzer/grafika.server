var GrafikaApp;
(function (GrafikaApp) {
    var FrameService = (function () {
        function FrameService(appCommon, authService, apiService) {
            this.appCommon = appCommon;
            this.authService = authService;
            this.apiService = apiService;
        }
        FrameService.prototype.get = function (animation) {
            return this.apiService.get('animations/' + animation._id + '/frames');
        };
        FrameService.prototype.update = function (animation, data) {
            return this.apiService.post('animations/' + animation._id + '/frames', data);
        };
        FrameService.$inject = [
            'appCommon',
            'authService',
            'apiService'
        ];
        return FrameService;
    }());
    GrafikaApp.FrameService = FrameService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=frame-service.js.map