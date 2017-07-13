var GrafikaApp;
(function (GrafikaApp) {
    var ContextMenuDirective = (function () {
        function ContextMenuDirective() {
            this.restrict = 'A';
            this.scope = true;
            this.transclude = false;
            this.link = function (scope, element, attrs, ctr) {
                var ulId = '#' + attrs['contextMenu'];
                var ul = jQuery(ulId).css({ display: 'none' });
                var last = null;
                var xscope = scope;
                var body = jQuery(document.body);
                ul.parent().remove(ulId); // remove from current parent
                jQuery('body').append(ul); // append to body
                jQuery(element).on('contextmenu', function (event) {
                    ul.css({ position: "fixed", display: "block", left: event.clientX + 'px', top: event.clientY + 'px', zIndex: 3000 });
                    if (ul.position().top + ul.height() > body.offset().top + body.height()) {
                        var top_1 = ul.position().top - ul.height();
                        if (top_1 > 5)
                            ul.css({ top: ul.position().top - ul.height() });
                    }
                    xscope.$apply();
                    event.preventDefault();
                });
                jQuery(document).click(function (event) {
                    var target = jQuery(event.target);
                    if (!target.is(".popover") && !target.parents().is(".popover")) {
                        if (last === event.timeStamp)
                            return;
                        ul.css({ 'display': 'none' });
                    }
                });
            };
        }
        ContextMenuDirective.factory = function () {
            var directive = function () { return new ContextMenuDirective(); };
            return directive;
        };
        return ContextMenuDirective;
    }());
    GrafikaApp.ContextMenuDirective = ContextMenuDirective;
})(GrafikaApp || (GrafikaApp = {}));
