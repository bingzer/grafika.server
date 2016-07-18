var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var MyAnimationsController = (function (_super) {
        __extends(MyAnimationsController, _super);
        function MyAnimationsController(appCommon, animationService, authService) {
            _super.call(this, appCommon, animationService, authService);
        }
        MyAnimationsController.prototype.list = function () {
            var _this = this;
            var paging = new GrafikaApp.Paging({ isPublic: false, userId: this.authService.getUser()._id });
            this.animationService.list(paging).then(function (res) {
                _this.animations = res.data;
            });
        };
        MyAnimationsController.prototype.create = function (ev) {
            var _this = this;
            var useFullScreen = (this.appCommon.$mdMedia('sm') || this.appCommon.$mdMedia('xs'));
            this.appCommon.$mdDialog.show({
                controller: 'AnimationCreateController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                templateUrl: '/app/animation/create.html',
                clickOutsideToClose: true,
                targetEvent: ev
            }).then(function (answer) {
                _this.appCommon.toast('Animation is created');
            });
        };
        MyAnimationsController.$inject = ['appCommon', 'animationService', 'authService'];
        return MyAnimationsController;
    }(GrafikaApp.AnimationListController));
    GrafikaApp.MyAnimationsController = MyAnimationsController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=mine.js.map