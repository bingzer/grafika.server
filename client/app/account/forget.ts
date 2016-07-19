module GrafikaApp {
    export class ForgetController extends DialogController {
        public static $inject = ['appCommon'];
        constructor (appCommon: AppCommon) {
            super(appCommon);
        }
    }
}