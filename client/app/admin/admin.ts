module GrafikaApp {
    export class AdminController extends AuthController {        
        serverConfigs = [];
        clientConfigs = [];
        configQuery: string = "";
        userQuery: string = "";

        animPaging: AdminPaging = new AdminPaging();
        animations: Grafika.IAnimation[];

        public static $inject = ['appCommon', 'animationService', 'adminService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
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
            this.adminService.listAnimations(this.animPaging).then((result) => {
                this.animations = result.data;
            });
        }

        canEdit() {
            return true;
        }

        canDelete() {
            return true;
        }

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