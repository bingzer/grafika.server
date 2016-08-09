module GrafikaApp {
    export class MyAnimationsController extends AnimationListController {

        public static $inject = ['appCommon', 'animationService', 'authService' ];
        constructor(
            appCommon: AppCommon,
            animationService: AnimationService,
            authService: AuthService
        ){
            super(appCommon, animationService, authService);
        }

        list() {
            var paging = new Paging({ userId: this.authService.getUser()._id });
            this.animationService.list(paging).then((res) => {
                this.animations = res.data;
            });
        }
        
        create(ev: MouseEvent){
            return this.appCommon.showDialog('AnimationCreateController', '/app/animation/create.html', ev).then((answer) => {
                return this.appCommon.toast('Animation is created');
            });
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
    }
}