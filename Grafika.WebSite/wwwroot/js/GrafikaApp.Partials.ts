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
            let shouldAppend = elem.data('partial') === 'append';

            let onResult: IAjaxResultCallback = (err: Error, result: any, elem: JQuery): JQueryPromise<any> => {
                if (shouldAppend) elem.append(result);
                else elem.html(result);
                return jQuery.when(result);
            };

            return GrafikaApp.sendAjax(elem, onResult);
        }
    }
}