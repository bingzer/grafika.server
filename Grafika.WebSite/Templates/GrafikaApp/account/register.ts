module GrafikaApp {
    export class RegisterController extends DialogController {
        message: string = 'After signing up, you will receive email to activate your account.';
        name: string = '';
        email: string = '';
        busy: boolean = false;
        done: boolean = false;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, private authService: AuthService){
            super(appCommon);
        }
        
        register(){
            this.message = 'Sending verification email...';
            this.busy = true;
            this.authService.register({ name: this.name, username: this.email, password: 'fake-password'})
                .then((res) => {
                    if (res.status == 200) this.message = "Email has been sent";
                    else this.handleError(res);
                    this.busy = false;
                    this.done = true;
                })
                .catch((error) => {
                    return this.handleError(error);
                });
        }

        handleError(err){
            this.message = this.appCommon.formatErrorMessage(err);
            this.busy = false;
        }
    }
}