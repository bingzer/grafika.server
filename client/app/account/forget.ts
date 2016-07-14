module GrafikaApp {
    export class ForgetController {
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