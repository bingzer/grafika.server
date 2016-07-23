module GrafikaApp {
    export class ProfileController extends DialogController {
        user: Grafika.IUser;

        public static $inject = ['appCommon', 'authService', 'userService'];
        constructor (appCommon: AppCommon,
            private authService: AuthService,
            private userService: UserService
        ) {
            super(appCommon);
            this.userService.get(this.authService.getUser()._id).then((res) => {
                this.user = res.data;
            });
        }

        showPasswordDialog(event: MouseEvent) {
            this.appCommon.showDialog("PasswordController", "app/account/reset.html", event);
        }

        checkUsernameAvailability() {
            this.userService.checkAvailability(this.user.email, this.user.username)
                .then(() => this.appCommon.toast(this.user.username + ' is available'))
                .catch((err) => this.appCommon.toastError(err));
        }

        save() {
            this.userService.update(this.user)
                .then(() => {
                    this.appCommon.toast('Saved!');
                })
                .catch((err) => this.appCommon.toastError(err));
        }
    }
}