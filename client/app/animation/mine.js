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
            this.user = authService.getUser();
        }
        MyAnimationsController.prototype.create = function (ev) {
            var _this = this;
            return this.appCommon.showDialog('AnimationCreateController', '/app/animation/create.html', ev).then(function (answer) {
                return _this.appCommon.toast('Animation is created');
            });
        };
        MyAnimationsController.prototype.canEdit = function () {
            return true;
        };
        MyAnimationsController.prototype.canDelete = function () {
            return true;
        };
        MyAnimationsController.prototype.confirmDelete = function (anim) {
            var _this = this;
            this.appCommon.confirm("Delete?", anim.name).then(function (result) {
                if (result) {
                    _this.animationService.delete(anim._id).then(function (result) {
                        _this.list();
                        _this.appCommon.toast(anim.name + ' deleted');
                    });
                }
            });
        };
        MyAnimationsController.prototype.createPaging = function () {
            return new GrafikaApp.Paging({ userId: this.authService.getUser()._id, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: '-dateModified' });
        };
        MyAnimationsController.$inject = ['appCommon', 'animationService', 'authService'];
        return MyAnimationsController;
    }(GrafikaApp.AnimationListController));
    GrafikaApp.MyAnimationsController = MyAnimationsController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=mine.js.map