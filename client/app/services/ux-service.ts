module GrafikaApp {
    export class UxService extends BaseService {
        public pageTitle: string;

        public static $inject = ['appCommon', '$rootScope'];
        constructor (appCommon: AppCommon, $rootScope: ng.IRootScopeService) {
			super(appCommon);

            this.pageTitle = appCommon.appConfig.appTitle;
            
            $rootScope.$on('$stateChangeStart', (event, toState: ng.ui.IState, toParams: ng.ui.IStateParamsService, fromState, fromParams) =>{
                // from data
                if (toState.data && toState.data.pageTitle) {
                    this.pageTitle = toState.data.pageTitle;
                    return;
                }

                this.pageTitle = 'Grafika';
            });
        }
    }
}