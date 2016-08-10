var GrafikaApp;
(function (GrafikaApp) {
    var NoResultDirective = (function () {
        function NoResultDirective() {
            this.restrict = 'AE';
            this.template = "<div layout-fill layout=\"column\" layout-align=\"center center\" style=\"margin-top: 32px\">\n                        <img src=\"/content/images/sad_lightgray_128.png\">\n                        <div class=\"md-subtitle\" style=\"color: #d3d3d3; margin-top: 16px\">No results</div>\n                    </div>";
        }
        NoResultDirective.factory = function () {
            var directive = function () { return new NoResultDirective(); };
            return directive;
        };
        return NoResultDirective;
    }());
    GrafikaApp.NoResultDirective = NoResultDirective;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=no-result.js.map