module GrafikaApp {
    export class UserController extends BaseController {
        private user: Grafika.IUser;
        private paging: Paging;
        private animations: Grafika.IAnimation[];

        public static $inject = ['appCommon', 'animationService', 'userService'];
        constructor(
            appCommon: AppCommon,  
            private animationService: AnimationService,
            private userService: UserService
        ){
            super(appCommon);
            this.list();
        }

        list() {
            this.userService.get(this.appCommon.$stateParams['_id'])
                .then((res) => {
                    this.user = new User(res.data);
                    this.loadAnimations()
                });
        }

        loadAnimations() {
            this.paging = new Paging({ userId: this.user._id, isPublic: true });
            this.animationService.list(this.paging).then((res) => {
                this.animations = res.data;
            });
        }
    }
}