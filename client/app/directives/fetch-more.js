var GrafikaApp;
(function (GrafikaApp) {
    var FetchMoreDirective = (function () {
        function FetchMoreDirective() {
            this.restrict = 'AE';
            this.template = "<div layout=\"row\" layout-align=\"center center\" layout-margin flex>\n                        <gf-spinner ng-show=\"vm.busy\"></gf-spinner>\n                        <md-button class=\"md-button md-icon-button\" ng-click=\"vm.list()\" ng-disabled=\"vm.fetching\" ng-show=\"vm.canLoadMore\">\n                            <md-icon md-font-library=\"material designs\">expand_more</md-icon>\n                            <md-tooltip>Load more...</md-tooltip>\n                        </md-button>\n                    </div>";
        }
        FetchMoreDirective.factory = function () {
            var directive = function () { return new FetchMoreDirective(); };
            return directive;
        };
        return FetchMoreDirective;
    }());
    GrafikaApp.FetchMoreDirective = FetchMoreDirective;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=fetch-more.js.map