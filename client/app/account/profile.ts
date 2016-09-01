module GrafikaApp {
    export class ProfileController extends DialogController {
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

        changePassword(event: MouseEvent) {
            this.appCommon.showDialog("app/account/reset.html", "PasswordController", event);
        }

        checkUsernameAvailability() {
            this.userService.checkAvailability(this.user.email, this.user.username)
                .then(() => this.appCommon.toast(this.user.username + ' is available'))
                .catch((err) => this.appCommon.toastError(err));
        }

        save(): ng.IPromise<any> {
            return this.userService.update(this.user)
                .then(() => {
                    this.needsUpdate = false;
                    this.appCommon.toast('Saved!');
                    return this.authService.authenticate();
                })
                .catch((err) => this.appCommon.toastError(err));
        }
		
		uploadAvatar(avatar: IImageData): ng.IPromise<any> {
            return this.userService.saveAvatar(this.user, avatar.mime)
                .then((signedUrl) => this.userService.upload(signedUrl.data, avatar.getBlob()))
                .then(() => {
                    this.user.prefs.avatar = `${this.appCommon.appConfig.userBaseUrl}${this.user._id}/avatar`;
                    return this.save();
                })
                .finally(() => window.location.reload(true) );
		}
    }
}