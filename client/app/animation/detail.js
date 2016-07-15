var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function () {
        function AnimationDetailController($stateParams, appCommon, animationService, authService) {
            var _this = this;
            this.$stateParams = $stateParams;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.authService = authService;
            this.canEdit = false;
            this.animationService.get(this.$stateParams['_id']).then(function (res) {
                _this.animation = res.data;
                if (_this.authService.isAuthorized('user'))
                    _this.canEdit = _this.authService.getUser()._id === _this.animation.userId;
            });
        }
        AnimationDetailController.$inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'authService'
        ];
        return AnimationDetailController;
    }());
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=detail.js.map