module GrafikaApp {

    export class AnimationCreateController extends DialogController {
        name: string;
        width: number = 800;
        height: number = 400;
        isPublic: boolean;
        
        public static $inject = ['appCommon', 'animationService'];
        constructor(
            appCommon: AppCommon, 
            private animationService: AnimationService){
            super(appCommon);
        }

        create() {
            var anim = new Animation();
            anim.name = this.name;
            anim.width = this.width;
            anim.height = this.height;
            anim.isPublic = this.isPublic;
            this.animationService.create(anim).then((res) => {
                var anim = res.data;
                this.appCommon.$state.go('drawing', { _id: anim._id });
                this.close();
            })
        }

    }
}