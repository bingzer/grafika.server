var GrafikaApp;
(function (GrafikaApp) {
    var GfAdsense = (function () {
        function GfAdsense() {
            this.restrict = 'AE';
            this.template = "<div layout-padding>\n                        <adsense\n                        ad-client=\"ca-pub-6423861965667645\"\n                        ad-slot=\"2335720328\"\n                        inline-style=\"display:block\" ad-format=\"auto\"></adsense>\n                    </div>";
        }
        GfAdsense.factory = function () {
            var directive = function () { return new GfAdsense(); };
            return directive;
        };
        return GfAdsense;
    }());
    GrafikaApp.GfAdsense = GfAdsense;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=gf-adsense.js.map