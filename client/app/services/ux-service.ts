module GrafikaApp {
    export class UxService extends BaseService {
        public pageTitle: string;

        public static $inject = ['appCommon'];
        constructor (appCommon: AppCommon) {
			super(appCommon);

            this.pageTitle = appCommon.appConfig.appTitle;
        }
    }
}