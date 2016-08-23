module GrafikaApp {
    export class MyAnimationsController extends AnimationListController {
        user: Grafika.IUser;

        public static $inject = ['appCommon', 'animationService', 'authService' ];
        constructor(
            appCommon: AppCommon,
            animationService: AnimationService,
            authService: AuthService
        ){
            super(appCommon, animationService, authService);
            this.user = authService.getUser();
        }
        
        create(ev: MouseEvent){
            return this.appCommon.showDialog('AnimationCreateController', '/app/animation/create.html', ev).then((answer) => {
                return this.appCommon.toast('Animation is created');
            });
		} 

        canEdit(){
            return true;
        }

        canDelete(){
            return true;
        }

        confirmDelete(anim: Grafika.IAnimation) {
            this.appCommon.confirm("Delete?", anim.name).then((result) => {
                if (result) {
                    this.animationService.delete(anim._id).then((result) => {
                        this.list();
                        this.appCommon.toast(anim.name + ' deleted');
                    });
                } 
            })
        }

        protected createPaging() : Paging {
            return new Paging({ userId: this.authService.getUser()._id, limit: this.appCommon.appConfig.fetchSize, skip: 0});
        }
    }
}