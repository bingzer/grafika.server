module GrafikaApp {

    export class AnimationCreateController extends DialogController {
        name: string;
        width: number = 800;
        height: number = 450;
        isPublic: boolean;
        orientations: string[] = ['Landscape', 'Portrait'];
        orientation: string = 'Landscape';
        
        public static $inject = ['appCommon', 'authService', 'animationService'];
        constructor(
            appCommon: AppCommon, 
            private authService: AuthService,
            private animationService: AnimationService){
            super(appCommon);
            this.isPublic = this.authService.getUser().prefs.drawingIsPublic;
            this.width = this.appCommon.appConfig.defaultAnimationWidth;
            this.height = this.appCommon.appConfig.defaultAnimationHeight;
        }

        create() {
            let anim = {
                name: this.name,
                isPublic: this.isPublic
            } as Grafika.IAnimation;

            if (this.orientation === 'Landscape'){
                anim.width = this.width;
                anim.height = this.height;
            }
            else {
                anim.width = this.height;
                anim.height = this.width;
            }
            
            this.animationService.create(anim).then((res) => {
                this.close();
                this.appCommon.showLoadingModal().then(() => {
                    let anim = res.data;
                    this.appCommon.$state.go('drawing', { _id: anim._id });
                })
            })
        }

    }
}