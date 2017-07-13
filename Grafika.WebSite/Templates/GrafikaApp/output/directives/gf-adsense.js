var GrafikaApp;
(function (GrafikaApp) {
    var GfAdsense = (function () {
        function GfAdsense(appCommon) {
            this.appCommon = appCommon;
            this.restrict = 'AE';
            this.templateDisable = "<div style=\"width: 100%; display: inline-block;\" layout-padding layout-align=\"center\">\n                            <span style=\"display: block; text-align: center; color: gray\">No Ads (disabled)</span>\n                           </div>";
            this.templateAdsense = "<div style=\"width: 100%; display: inline-block\" layout-padding>\n                            <adsense\n                                ad-client=\"ca-pub-6423861965667645\"\n                                ad-slot=\"2335720328\"\n                                inline-style=\"display:block\" ad-format=\"auto\"></adsense>\n                           </div>";
            this.template = this.resolveTemplate;
        }
        GfAdsense.prototype.resolveTemplate = function () {
            var enabled = this.appCommon.$location.host().indexOf('localhost') < 0;
            if (enabled)
                return this.templateAdsense;
            else
                return this.templateDisable;
        };
        GfAdsense.factory = function () {
            var directive = function (appCommon) { return new GfAdsense(appCommon); };
            directive.$inject = ['appCommon'];
            return directive;
        };
        return GfAdsense;
    }());
    GrafikaApp.GfAdsense = GfAdsense;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/directives/gf-adsense.js.map