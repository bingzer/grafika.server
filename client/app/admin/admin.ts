module GrafikaApp {
    export class AdminController extends AuthController {        
        serverConfigs = [];
        clientConfigs = [];

        public static $inject = ['appCommon', 'animationService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private adminService: AdminService){
            super(appCommon, authService);

            this.fetch();
        }

        fetch() {
            this.serverConfigs = [];
            this.clientConfigs = [];
            this.adminService.getServerInfo().then((result) => {
                this.pushObject(this.serverConfigs, null, result.data);
                this.pushObject(this.clientConfigs, null, this.appCommon.appConfig);
            })
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

		private pushObject(configs, parentName, obj){
			Object.keys(obj).forEach(function (key){
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