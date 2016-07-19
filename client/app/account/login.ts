module GrafikaApp {
    export class LoginController extends AuthController {
        username: string;
        password: string;

        public static $inject = ['appCommon', 'authService'];
        constructor (appCommon: AppCommon, authService: AuthService){
            super(appCommon, authService);
        }

        register() {
            this.appCommon.$mdDialog.show({
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'app/account/register.html'
            });
        }

        login(provider: string) {
            var loginProvider = provider;
            this.appCommon.showLoadingModal().then(() =>{
                    return this.authService.login({ username: this.username, password: this.password }, provider);
                })
                .then((res) => {
                    if (!loginProvider) this.appCommon.navigateHome();
                    else this.appCommon.toast('Connecting to ' + loginProvider);
                })
                .then(() => {
                    return this.appCommon.hideLoadingModal();
                })
                .finally(() => {
                    this.reset();
                })
        }

        reset() {
            this.username = '';
            this.password = '';
        }
    }
}