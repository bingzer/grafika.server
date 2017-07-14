var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var MyBackgroundsController = (function (_super) {
        __extends(MyBackgroundsController, _super);
        function MyBackgroundsController(appCommon, backgroundService, authService) {
            var _this = _super.call(this, appCommon, backgroundService, authService) || this;
            _this.user = authService.getUser();
            if (_this.appCommon.$location.search().new) {
                _this.create();
                _this.appCommon.cleanUrlQueries();
            }
            return _this;
        }
        MyBackgroundsController.prototype.create = function (ev) {
            var _this = this;
            return this.appCommon.showDialog('/app/background/create.html', 'BackgroundCreateController', ev).then(function (answer) {
                return _this.appCommon.toast('Background is created');
            });
        };
        MyBackgroundsController.prototype.canEdit = function () {
            return true;
        };
        MyBackgroundsController.prototype.canDelete = function () {
            return true;
        };
        MyBackgroundsController.prototype.confirmDelete = function (background) {
            var _this = this;
            this.appCommon.confirm("Delete?", background.name).then(function (result) {
                if (result) {
                    _this.backgroundService.delete(background._id).then(function (result) {
                        _this.list();
                        _this.appCommon.toast(background.name + ' deleted');
                    });
                }
            });
        };
        MyBackgroundsController.prototype.createPaging = function () {
            return new GrafikaApp.Paging({ userId: this.authService.getUser()._id, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: '-dateModified' });
        };
        MyBackgroundsController.$inject = ['appCommon', 'backgroundService', 'authService'];
        return MyBackgroundsController;
    }(GrafikaApp.BackgroundListController));
    GrafikaApp.MyBackgroundsController = MyBackgroundsController;
})(GrafikaApp || (GrafikaApp = {}));
