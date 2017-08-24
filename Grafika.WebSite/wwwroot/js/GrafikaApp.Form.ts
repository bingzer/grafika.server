declare var FormSerializer: any;
interface JQuery {
    serializeObject(): JQuery;
    serializeJSON(): JQuery;
}

module GrafikaApp {

    // -- use dot.net notaions
    jQuery.extend(FormSerializer.patterns, {
        validate: /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)*(?:\[\])?$/i
    });

    export class Form {

        public static validate(form: JQuery) {
            form = jQuery(form).closest('form');
            let submitButton = form.find('input[type=submit]');

            if (form.valid()) submitButton.removeAttr('disabled');
            else submitButton.attr('disabled', 'disabled');
        }

        /**
         * Call on the <form>
         * @param elem
         */
        public static onSubmit(elem: any): boolean {
            GrafikaApp.Form.submit(elem);
            return false;
        }

        /**
         * Invoke the actual form.submit()
         * @param elem
         */
        public static submit(elem: any, e?: JQueryEventObject) {
            if (e) e.preventDefault();
            let form = $(elem).closest('form');
            if (!form) throw new Error('no form found');

            let type = form.data('type') || 'application/json';
            function getData() {
                if (type === 'application/json')
                    return form.serializeJSON();
                else if (type === 'application/x-www-form-urlencoded')
                    return form.serialize();
                return form.serializeObject();
            }

            form.data('url', form.attr('action') || form.data('url'));
            form.data('method', form.attr('method') || form.data('method'));
            form.data('data', getData());
            form.data('process-data', true);
            form.data('type', type);

            return GrafikaApp.sendAjax(form);
        }
    }
}