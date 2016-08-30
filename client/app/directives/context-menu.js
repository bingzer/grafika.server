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
                ul.parent().remove(ulId);
                jQuery('body').append(ul);
                jQuery(element).on('contextmenu', function (event) {
                    ul.css({ position: "fixed", display: "block", left: event.clientX + 'px', top: event.clientY + 'px' });
                    if (ul.position().top + ul.height() > ul.parent().offset().top + ul.parent().height()) {
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
//# sourceMappingURL=context-menu.js.map