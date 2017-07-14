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
    var ResourceListController = (function (_super) {
        __extends(ResourceListController, _super);
        function ResourceListController(appCommon, resourceService, resources, grafika) {
            var _this = _super.call(this, appCommon) || this;
            _this.resourceService = resourceService;
            _this.resources = resources;
            _this.grafika = grafika;
            _this.list();
            return _this;
        }
        ResourceListController.prototype.list = function () {
            if (!this.resources || this.resources.length <= 0) {
                this.appCommon.toastError('No resources available');
                this.close();
            }
        };
        ResourceListController.prototype.select = function (resourceId) {
            var resource = this.resources.filter(function (r) { return r.id == resourceId; })[0];
            this.close(resource);
        };
        ResourceListController.prototype.deleteResource = function (resourceId) {
            var _this = this;
            this.resourceService.del(this.grafika.getAnimation(), resourceId).then(function () {
                _this.grafika.deleteResource(resourceId);
                _this.resources = _this.grafika.getResources();
                _this.list();
            });
        };
        return ResourceListController;
    }(GrafikaApp.DialogController));
    ResourceListController.$inject = ['appCommon', 'resourceService', 'resources', 'grafika'];
    GrafikaApp.ResourceListController = ResourceListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/resources/list.js.map