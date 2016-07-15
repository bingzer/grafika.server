module GrafikaApp {
    export class DialogController {
        public static $inject = [
            '$mdDialog'
        ];
        constructor(
            public $mdDialog: ng.material.IDialogService
        ){
            // nothing
        }

        close(response?: any) {
            this.$mdDialog.hide(response);
        }

        cancel() {
            this.$mdDialog.cancel();
        }
    }
}