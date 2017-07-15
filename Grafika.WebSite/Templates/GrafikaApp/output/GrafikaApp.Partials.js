var GrafikaApp;
(function (GrafikaApp) {
    var Partials = (function () {
        function Partials() {
        }
        Partials.loadElements = function () {
            $('[data-partial=auto], [data-partial=tab].active').toArray().forEach(function (elem) { return GrafikaApp.Partials.renderPartial(elem); });
            $('[data-partial=tab]').each(function (i, elem) {
                $('a[href="#' + $(elem).attr('id') + '"]').on('shown.bs.tab', function (e) {
                    GrafikaApp.Partials.renderPartial(elem).then(function () { return $(elem).data('loaded', true); });
                });
            });
        };
        Partials.renderPartial = function (elem) {
            elem = $(elem);
            if (!elem.data('url'))
                throw new Error('Expecting data-url');
            if (elem.data('loaded'))
                return jQuery.when();
            var target = elem.data('target');
            var opts = {
                url: elem.data('url'),
                method: elem.data('method'),
                data: elem.data('data'),
            };
            var doSend = function () {
                return jQuery.ajax(opts).done(function (res) {
                    if (target)
                        target.html(res);
                    else
                        elem.html(res);
                    return jQuery.when(res);
                });
            };
            return doSend();
        };
        return Partials;
    }());
    GrafikaApp.Partials = Partials;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/GrafikaApp.Partials.js.map