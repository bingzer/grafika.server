module GrafikaApp {
    export class AdminController extends AuthController {        
        serverConfigs = [];
        clientConfigs = [];
        configQuery: string = "";
        userQuery: string = "";

        animPaging: Paging = new Paging();
        animations: Grafika.IAnimation[] = [];
        hasMoreAnims: boolean = true;

        userPaging: Paging = new Paging();
        users: Grafika.IUser[] = []; 
        hasMoreUsers: boolean = true;
        
        busy: boolean = false;

        public static $inject = ['appCommon', 'authService', 'animationService', 'adminService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private animationService: AnimationService,
            private adminService: AdminService){
            super(appCommon, authService);
            this.userPaging.sort = "-lastSeen";
        }

        fetchServerInfo() {
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.adminService.getServerInfo().then((result) => {
                this.pushObject(this.serverConfigs, null, result.data);
                this.pushObject(this.clientConfigs, null, this.appCommon.appConfig);
            })
        }

        fetchAnimations(append?: boolean) {
            if (!append) this.animPaging.skip = 0;

            this.busy = true;
            this.adminService.listAnimations(this.animPaging)
                .then((result) => this.animationService.injectResources(result) )
                .then((res) => {
                    let anims = <Grafika.IAnimation[]> res.data;
                    if (!append) this.animations = anims;
                    else this.animations = this.animations.concat(anims);

                    this.busy = false;
                    this.hasMoreAnims = anims.length >= this.animPaging.limit;
                    if (this.hasMoreAnims)
                        this.animPaging = this.animPaging.next();
                });
        }

        fetchUsers(append?: boolean) {
            if (!append) this.userPaging.skip = 0;

            this.adminService.listUsers(this.userPaging)
                .then((results) => {
                    results.data.forEach(u => {
                        var user = <any>u;
                        if (user.stats && user.stats.dateLastSeen)
                            user.dateLastSeenDisplay = new Date(user.stats.dateLastSeen).toLocaleDateString();
                        user.dateCreatedDisplay = new Date(u.dateModified).toLocaleDateString();
                        user.dateModifiedDisplay = new Date(u.dateCreated).toLocaleDateString()
                    });
                    return results;
                })
                .then((results) => {
                    let users = results.data;
                    if (!append) this.users = users;
                    else this.users = this.users.concat(users);

                    this.busy = false;
                    this.hasMoreUsers = users.length >= this.userPaging.limit;
                    if (this.hasMoreUsers)
                        this.userPaging = this.userPaging.next();
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