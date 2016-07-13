module grafikaApp {
    export class ResetController {
        public static $inject = [
            '$mdDialog',
            'appCommon',
            'authService'
        ];

        constructor (
            $mdDialog: ng.material.IDialogService,
            appCommon: AppCommon,
            authService: AuthService
        ){

        }
    }
}