var GrafikaApp;
(function (GrafikaApp) {
    var DisqusConfig = (function () {
        function DisqusConfig(appCommon, uniqueId) {
            this.disqus_identifier = uniqueId;
            this.disqus_url = 'http://grafika.herokuapp.com/' + appCommon.$location.url();
            this.disqus_api_key = 'reBkv3Z517WqqbOMhaPOWx710h0JqXRf9X71HMsDTkEfmdvoRYGfxZSJXlQrgzgj';
            this.disqus_shortname = 'grafika-app';
            this.disqus_title = 'grafika';
        }
        return DisqusConfig;
    }());
    GrafikaApp.DisqusConfig = DisqusConfig;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=disqus-config.js.map