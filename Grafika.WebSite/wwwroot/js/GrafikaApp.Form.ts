module GrafikaApp {
    export class Form {
        public static submit(elem) {
            let form = $(elem).closest('form');
            if (!form) throw new Error('no form found');

            form.submit((e) => {
                e.preventDefault();

                let callback = form.data('callback');
                let type = form.data('type') || 'application/x-www-form-urlencoded'
                let options: JQueryAjaxSettings = {
                    url: form.attr('action') || form.data('url'),
                    method: form.attr('method') || form.data('method'),
                    data: (type == 'application/json' ? form.serializeArray() : form.serialize()),
                    dataType: type,
                };
                return jQuery.ajax(options).done((res, textStatus, xhr) => {
                    let $result = res;
                    let $textStatus = textStatus;
                    let $xhr = xhr;
                    eval(callback);
                });
            });
        }
    }
}