module GrafikaApp {
    export class AnimationEditController extends DialogController {
        animation: Grafika.IAnimation;
        
        public static $inject = ['appCommon', 'animationService'];
        constructor(
            appCommon: AppCommon, 
            private animationService: AnimationService){
            super(appCommon);
            this.load();
        }

        load() {
            this.animationService.get(this.appCommon.$stateParams['_id']).then((res) => {
                this.animation = res.data;
            });
        }

        save() {
            this.animation.dateModified = Date.now();
            this.animationService.update(this.animation).then((res) => {
                this.close().then(() => this.appCommon.toast('Saved'));
            })
        }
    }
}