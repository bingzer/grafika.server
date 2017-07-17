module GrafikaApp {
    export class Dialog {
        public static loadElements() {
            $('a[data-dialog],button[data-dialog]').each((index, elem) => {
                let options = $(elem).data() as IDialogOptions;
                options.url = $(elem).data('url');
                $(elem).on('click', () => Dialog.dialog(options));
            });
        }

        public static dialog(options: IDialogOptions): Q.IPromise<any> {
            if (options.url) {
                return jQuery.ajax(options).then((data, status, xhr) => {
                    options.message = data;
                    return jQuery.when(bootbox.dialog(options));
                });
            }

            return jQuery.when(bootbox.dialog(options));
        }
    }


    export interface IDialogOptions extends BootboxDialogOptions {
        url?: string;
    }
}