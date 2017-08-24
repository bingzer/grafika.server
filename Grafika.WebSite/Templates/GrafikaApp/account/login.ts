module GrafikaApp {
    export class LoginController extends AuthController {
        username: string;
        password: string;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, authService: AuthService){
            super(appCommon, authService);
        }

        register() {
            return this.appCommon.showDialog('app/account/register.html', 'RegisterController');
        }

        login(provider: string) {
            let loginProvider = provider;
            this.appCommon.showLoadingModal().then(() => this.authService.login({ username: this.username, password: this.password }, provider))
                .then((res) => {
                    if (!loginProvider) {
                        let query = this.appCommon.$location.search();
                        if (query.url) {
                            let url = decodeURIComponent(query.url);
                            this.appCommon.cleanUrlQueries();
                            this.appCommon.$timeout(() => this.appCommon.navigate(url), 500);
                        }
                        else this.appCommon.navigateHome();
                    }
                    else this.appCommon.toast('Connecting to ' + loginProvider);
                })
                .catch((res) => {
                    this.appCommon.toastError(res);
                    return this.appCommon.$q.when(true);
                })
                .finally(() => {
                    this.appCommon.hideLoadingModal();
                    this.reset();
                });
        }

        forgetPassword(evt: MouseEvent) {
            this.appCommon.showDialog('app/account/forget.html', 'ForgetController', evt);
        }

        reset() {
            this.username = '';
            this.password = '';
            this.close();
        }

        close(){
            this.appCommon.$mdDialog.hide();
        }
    }
}