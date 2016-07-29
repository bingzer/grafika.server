var GrafikaApp;
(function (GrafikaApp) {
    var ActiveLinkDirective = (function () {
        function ActiveLinkDirective($location) {
            var _this = this;
            this.$location = $location;
            this.restrict = 'A';
            this.link = function (scope, element, attrs, ctr) {
                var clazz = attrs['activeLink'];
                var path = attrs['href'];
                path = path.substring(1);
                scope['location'] = _this.$location;
                scope.$watch('location.path()', function (newPath) {
                    while (newPath.length > 0 && newPath.substring(0, 1) == '/')
                        newPath = newPath.substring(1);
                    if (path == newPath) {
                        element.parent().addClass(clazz);
                    }
                    else {
                        element.parent().removeClass(clazz);
                    }
                });
            };
        }
        ActiveLinkDirective.factory = function () {
            var directive = function ($location) { return new ActiveLinkDirective($location); };
            directive.$inject = ['$location'];
            return directive;
        };
        return ActiveLinkDirective;
    }());
    GrafikaApp.ActiveLinkDirective = ActiveLinkDirective;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=active-link.js.map