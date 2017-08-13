module GrafikaApp {
    export class Dialog {
        public static loadElements(root?: any) {
            if (root == null) root = $(document);
            let $root = $(root);

            $root.find('[data-confirm]').each((index, elem) => {
                $(elem).on('click', (e: Event) => {
                    e.preventDefault();
                    let $elem = $(elem);
                    let options: IDialogConfirmOptions = {
                        message: $elem.data('message') || $elem.data('confirm'),
                        title: $elem.data('title') || "Confirmation",
                        confirmed: $elem.data('confirmed'),
                        href: $elem.attr('href'),
                        callback: (result: boolean) => {
                            if (result && options.confirmed) {
                                if (options.confirmed === 'continue' || options.confirmed == 'href') {
                                    GrafikaApp.navigateTo(options.href);
                                }
                                else eval($elem.data('confirmed'));
                            }
                        }
                    };
                    bootbox.confirm(options);
                });
            });
            $root.find('a[data-dialog],button[data-dialog]').each((index, elem) => {
                let options = $(elem).data() as IDialogOptions;
                options.url = $(elem).data('url') || $(elem).attr('href');
                $(elem).on('click', () => Dialog.dialog(options));
            });
        }

        public static dialog(options: IDialogOptions): Q.IPromise<any> {
            if (options.url) {
                let onResult: GrafikaApp.IAjaxResultCallback = (err: Error, result: any, elem: JQuery) => {
                    options.message = result;
                    let dialog = bootbox.dialog(options);

                    GrafikaApp.loadElements(dialog);
                    return jQuery.when(dialog);
                };

                return GrafikaApp.sendAjax(options, onResult);
            }

            return jQuery.when(bootbox.dialog(options));
        }

        public static imageUploadDialog(options: IImageUploadDialogOptions): Q.IPromise<any> {
            options.url = "/uploads/image";
            return GrafikaApp.Dialog.dialog(options);
        }

        public static close(elemOrSelected: any) {
            return (jQuery(elemOrSelected).closest('.modal') as any).modal('hide');
        }
    }


    export interface IDialogConfirmOptions extends BootboxConfirmOptions {
        confirmed?: string;
        href?: string;
    }
    export interface IDialogOptions extends BootboxDialogOptions {
        url?: string;
    }
    export interface IFileUploadDialogOptions extends IDialogOptions {
        url?: string;
    }
    export interface IImageUploadDialogOptions extends IDialogOptions {
        url?: string;
    }
}