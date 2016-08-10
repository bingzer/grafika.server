module GrafikaApp {
    export class SettingsController extends DialogController {
        user: Grafika.IUser;
        needsUpdate: boolean;

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

        save() {
            this.userService.update(this.user)
                .then(() => {
                    this.needsUpdate = false;
                    this.appCommon.toast('Saved!');
                })
                .catch((err) => this.appCommon.toastError(err));
        }
    }
}