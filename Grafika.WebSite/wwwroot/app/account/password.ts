module GrafikaApp {
    export class PasswordController extends DialogController {
        title: string;
        message: string;
        newPassword: string;
        currentPassword: string;
        requireCurrentPassword: boolean = true;
        busy: boolean = false;
        done: boolean = false;
        closable: boolean;
        validator: PasswordValidator;
        isPasswordValid: boolean = false;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, 
            private authService: AuthService){
            super(appCommon);
            this.title = 'Set Password';
            this.closable = true;
            this.requireCurrentPassword = (authService.getUser().local ? authService.getUser().local.registered : false);
            this.validator = new PasswordValidator();
            this.validatePassword();
        }

        changePassword() {
            this.busy = true;
            let pwd = { currPwd: this.currentPassword, newPwd: this.newPassword };
            this.authService.changePassword(pwd).then((res) => {
                this.appCommon.toast('Password is sucessfully changed');
                this.close();
            }).catch((res) => {
                this.message = this.appCommon.formatErrorMessage(res);
            }).finally(() => {
                this.busy = false;
                this.closable = true;
            });
        }

        validatePassword() {
            this.message = this.validator.validatePassword(this.newPassword);
            this.isPasswordValid = this.message.length == 0;
        }
    }
}