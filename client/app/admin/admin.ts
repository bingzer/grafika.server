module GrafikaApp {
    export class AdminController extends AuthController {        
        serverConfigs = [];
        clientConfigs = [];
        configQuery: string = "";
        userQuery: string = "";

        animPaging: QueryablePaging = new QueryablePaging();
        animations: Grafika.IAnimation[];

        userPaging: QueryablePaging = new QueryablePaging();
        users: Grafika.IUser[]; 

        public static $inject = ['appCommon', 'authService', 'animationService', 'adminService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private animationService: AnimationService,
            private adminService: AdminService){
            super(appCommon, authService);
        }

        fetchServerInfo() {
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.adminService.getServerInfo().then((result) => {
                this.pushObject(this.serverConfigs, null, result.data);
                this.pushObject(this.clientConfigs, null, this.appCommon.appConfig);
            })
        }

        fetchAnimations() {
            this.adminService.listAnimations(this.animPaging)
                .then((result) => this.animationService.injectThumbnailUrl(result) )
                .then((result) => {
                    this.animations = <Grafika.IAnimation[]>result.data;
                });
        }

        fetchUsers() {
            this.adminService.listUsers(this.userPaging).then((result) => {
                this.users = result.data;
            });
        }

        canEdit() {
            return true;
        }

        canDelete() {
            return true;
        }


		confirmUserVerification(user){
			this.appCommon.confirm('Send verification email to ' + user.email + '?')
					 .then(() => this.adminService.sendVerificationEmail(user) )
					 .then(() => this.appCommon.toast('Verification email sent to ' + user.email));
		};
		confirmUserPasswordReset(user){
			this.appCommon.confirm('Send reset password email to ' + user.email + '?')
					 .then(() => this.adminService.sendResetPasswordEmail(user) )
					 .then(() => this.appCommon.toast('Reset password email sent to ' + user.email) );
		};
		confirmDeactivate(user){
			this.appCommon.confirm('Inactivate ' + user.email + '?')
					 .then(() => this.adminService.inactivateUser(user) )
					 .then(() => {
                         this.fetchUsers();
                         this.appCommon.toast('User is inactivated');
                         return this.appCommon.$q.when(true); 
                     });
		};
		confirmActivate(user){
			this.appCommon.confirm('Activate ' + user.email + '?')
					 .then(() => this.adminService.activateUser(user))
					 .then(() => {
                         this.fetchUsers();
                         this.appCommon.toast('User is activated'); 
                         return this.appCommon.$q.when(true); 
                    });
		};

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

		private pushObject(configs, parentName, obj){
			Object.keys(obj).forEach((key) => {
				var value = obj[key];
				if(angular.isArray(value)){
					configs.push({ key: parentName ? parentName + '.' + key : key, value: JSON.stringify(value, null, ' ') });
				}
				else if (angular.isObject(value)) {
					this.pushObject(configs, parentName ? parentName + '.' + key : key, value);
				}
				else {
					configs.push({ key: parentName ? parentName + '.' + key : key, value: value });
				}
			});
		}
    }
}