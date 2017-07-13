var GrafikaApp;
(function (GrafikaApp) {
    var DisqusConfig = (function () {
        function DisqusConfig(appCommon, uniqueId) {
            this.disqus_identifier = uniqueId;
            this.disqus_api_key = 'reBkv3Z517WqqbOMhaPOWx710h0JqXRf9X71HMsDTkEfmdvoRYGfxZSJXlQrgzgj';
            this.disqus_shortname = 'grafika-app';
            this.disqus_title = 'grafika';
            //this.disqus_category_id = '';
        }
        return DisqusConfig;
    }());
    GrafikaApp.DisqusConfig = DisqusConfig;
})(GrafikaApp || (GrafikaApp = {}));
