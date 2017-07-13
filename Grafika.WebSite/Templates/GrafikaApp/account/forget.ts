module GrafikaApp {
    export class ForgetController extends DialogController {
        busy: boolean = false;
        email: string;
        message: string;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, private authService: AuthService) {
            super(appCommon);
        }

        sendForgetEmail() {
            this.busy = true;
            this.authService.resetPassword({ email: this.email }).then((res) => {
                this.appCommon.toast('Email sent');
                this.close();
            }).catch((res) => {
                this.message = this.appCommon.formatErrorMessage(res);
            }).finally(() => {
                this.busy = false;
            });
        }
    }
}