module GrafikaApp {

    export class AnimationCreateController extends DialogController {
        name: string;
        width: number = 800;
        height: number = 400;
        isPublic: boolean;

        public static $inject = [
            '$mdDialog',
            '$state',
            'animationService',
            'frameService'
        ];
        constructor(
            public $mdDialog: ng.material.IDialogService,
            public $state: ng.ui.IStateService,
            public animationService: AnimationService,
            public frameService: FrameService
        ){
            super($mdDialog);
        }

        create() {
            var anim = new Animation();
            anim.name = this.name;
            anim.width = this.width;
            anim.height = this.height;
            anim.isPublic = this.isPublic;
            this.animationService.create(anim).then((res) => {
                var anim = res.data;
                this.$state.go('editor', { _id: anim._id });
                this.close();
            })
        }

    }
}