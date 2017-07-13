module GrafikaApp {
    export class ResetController extends DialogController {
        title: string;
        subtitle: string;
        message: string;
        newPassword: string;
        busy: boolean = false;
        done: boolean = false;
        closable: boolean;
        validator: PasswordValidator;
        isPasswordValid: boolean = false;

        public static $inject = ['appCommon', 'authService', 'hash', 'email'];
        constructor (appCommon: AppCommon, 
            private authService: AuthService, 
            private hash: string, 
            private email: string){
            super(appCommon);
            this.validator = new PasswordValidator();
            this.title = 'Set Password';
            this.subtitle = 'Hi ' + email + ', please set your password';
            this.validatePassword();
        }

        changePassword() {
            this.busy = true;
            let user = {
                hash: this.hash,
                username: this.email,
                password: this.newPassword
            };
            this.authService.register(user).then((res) => {
                this.appCommon.toast('Password is sucessfully set, please re-login');
                this.close();
            }).catch((res) => {
                this.message = this.appCommon.formatErrorMessage(res);
                this.closable = true;
            }).finally(() => {
                this.busy = false;
                this.done = true;
            });
        }

        validatePassword() {
            this.message = this.validator.validatePassword(this.newPassword);
            this.isPasswordValid = this.message.length == 0;
        }
    }
}