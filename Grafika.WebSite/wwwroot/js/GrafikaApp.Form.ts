interface JQuery {
    serializeObject(): JQuery;
    serializeJSON(): JQuery;
}

module GrafikaApp {

    export class Form {
        /**
         * Call on the <form>
         * @param elem
         */
        public static onSubmit(elem): boolean {
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

            let type = form.data('type') || 'application/x-www-form-urlencoded';
            form.data('url', form.attr('action') || form.data('url'));
            form.data('method', form.attr('method') || form.data('method'));
            form.data('data', (type == 'application/json' ? form.serializeJSON() : form.serialize()));
            form.data('type', type);

            return GrafikaApp.sendAjax(form);
        }
    }
}