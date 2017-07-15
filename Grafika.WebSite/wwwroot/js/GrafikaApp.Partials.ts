module GrafikaApp {
    export class Partials {
        public static loadElements() {
            $('[data-partial=auto], [data-partial=tab].active').toArray().forEach((elem) => GrafikaApp.Partials.renderPartial(elem));
            $('[data-partial=tab]').each((i, elem) => {
                $('a[href="#' + $(elem).attr('id') + '"]').on('shown.bs.tab', (e) => {
                    GrafikaApp.Partials.renderPartial(elem).then(() => $(elem).data('loaded', true));
                });
            })
        }

        public static renderPartial(elem: any): JQueryPromise<any> {
            elem = $(elem);
            if (!elem.data('url')) throw new Error('Expecting data-url');
            if (elem.data('loaded')) return jQuery.when();

            let target = elem.data('target');
            let opts = {  
                url: elem.data('url'),
                method: elem.data('method'),
                data: elem.data('data'),
            };

            let doSend = (): JQueryPromise<any> => {
                return jQuery.ajax(opts).done((res) => {
                    if (target) target.html(res);
                    else elem.html(res);
                    return jQuery.when(res);
                });
            }

            return doSend();
        }
    }
}