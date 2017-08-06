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
                let onResult: GrafikaApp.IAjaxResultCallback = (err: Error, result: any, elem: JQuery) => {
                    options.message = result;
                    return jQuery.when(bootbox.dialog(options));
                };

                return GrafikaApp.sendAjax(options, onResult);
            }

            return jQuery.when(bootbox.dialog(options));
        }

        public static close(elemOrSelected: any) {
            return (jQuery(elemOrSelected).closest('.modal') as any).modal('hide');
        }
    }


    export interface IDialogOptions extends BootboxDialogOptions {
        url?: string;
    }
}