module GrafikaApp {

    export class DialogController {
        public static $inject = [
            '$mdDialog'
        ];
        constructor(
            public $mdDialog: ng.material.IDialogService
        ){
            // nothing
        }

        close() {
            this.cancel();
        }

        cancel() {
            this.$mdDialog.cancel();
        }
    }

    export class AnimationCreateController extends DialogController {
        name: string;
        width: number;
        height: number;
        isPublic: boolean;

        public static $inject = [
            '$mdDialog',
            '$state',
            'animationService',
            'frameService'
        ];
        constructor(
            public $mdDialog: ng.material.IDialogService,
            public $state: ng.ui.IState,
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
            this.animationService.create(anim).then(function (res){
                var anim = res.data;
                this.$state.go('editor', { _id: anim._id });
                this.cancel();
            })
        }

    }
}