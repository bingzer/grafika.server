module GrafikaApp {
    export class MyBackgroundsController extends BackgroundListController {
        user: Grafika.IUser;

        public static $inject = ['appCommon', 'backgroundService', 'authService' ];
        constructor(
            appCommon: AppCommon,
            backgroundService: BackgroundService,
            authService: AuthService
        ){
            super(appCommon, backgroundService, authService);
            this.user = authService.getUser();
            if (this.appCommon.$location.search().new){
                this.create();
                this.appCommon.cleanUrlQueries();
            }
        }
        
        create(ev?: MouseEvent){
            return this.appCommon.showDialog('/app/background/create.html', 'BackgroundCreateController', ev).then((answer) => {
                return this.appCommon.toast('Background is created');
            });
		} 

        canEdit(){
            return true;
        }

        canDelete(){
            return true;
        }

        confirmDelete(background: Grafika.IBackground) {
            this.appCommon.confirm("Delete?", background.name).then((result) => {
                if (result) {
                    this.backgroundService.delete(background._id).then((result) => {
                        this.list();
                        this.appCommon.toast(background.name + ' deleted');
                    });
                } 
            })
        }

        protected createPaging() : Paging {
            return new Paging({ userId: this.authService.getUser()._id, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: '-dateModified'});
        }
    }
}