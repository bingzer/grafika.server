var GrafikaApp;
(function (GrafikaApp) {
    var GfSpinner = (function () {
        function GfSpinner() {
            this.restrict = 'AE';
            this.template = "<div class=\"gf-spinner\">\n                        <div class=\"rect1\"></div>\n                        <div class=\"rect2\"></div>\n                        <div class=\"rect3\"></div>\n                        <div class=\"rect4\"></div>\n                        <div class=\"rect5\"></div>\n                    </div>";
        }
        GfSpinner.factory = function () {
            var directive = function () { return new GfSpinner(); };
            return directive;
        };
        return GfSpinner;
    }());
    GrafikaApp.GfSpinner = GfSpinner;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/directives/gf-spinner.js.map