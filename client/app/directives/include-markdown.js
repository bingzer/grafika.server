var GrafikaApp;
(function (GrafikaApp) {
    var IncludeMarkdownDirective = (function () {
        function IncludeMarkdownDirective() {
            this.restrict = 'AE';
            this.scope = {
                markdownUrl: '='
            };
            this.bindToController = true;
            this.controllerAs = 'vm';
            this.controller = IncludeMarkdownController;
        }
        IncludeMarkdownDirective.factory = function () {
            var directive = function () { return new IncludeMarkdownDirective(); };
            return directive;
        };
        return IncludeMarkdownDirective;
    }());
    GrafikaApp.IncludeMarkdownDirective = IncludeMarkdownDirective;
    var IncludeMarkdownController = (function () {
        function IncludeMarkdownController(appCommon, $element, $http) {
            var _this = this;
            this.appCommon = appCommon;
            this.$element = $element;
            this.$http = $http;
            this.$element.html('<p style="width: 100%">Loading markdown...</p>');
            $http.get(this.markdownUrl).then(function (res) { return _this.render(res); }).catch(function (res) { return _this.renderError(); });
        }
        IncludeMarkdownController.prototype.render = function (res) {
            var _this = this;
            var defer = this.appCommon.$q.defer();
            this.appCommon.$timeout(function () {
                if (!res)
                    defer.reject();
                else {
                    var html = markdown.toHTML(res.data);
                    _this.$element.html('<div>' + html + '</div>');
                    defer.resolve();
                }
            }, 500);
            return defer.promise;
        };
        IncludeMarkdownController.prototype.renderError = function () {
            var _this = this;
            var defer = this.appCommon.$q.defer();
            this.appCommon.$timeout(function () {
                var html = '<p class="md-warn">Unable to retrieve data</p>';
                _this.$element.html('<div>' + html + '</div>');
                defer.resolve();
            }, 500);
            return defer.promise;
        };
        IncludeMarkdownController.$inject = ['appCommon', '$element', '$http'];
        return IncludeMarkdownController;
    }());
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=include-markdown.js.map