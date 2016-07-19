module GrafikaApp {
    export class AnimationListController extends BaseController {
        animations: Animation[];
        selectedAnimationId: string;

        public static $inject = ['appCommon', 'animationService', 'authService' ];
        constructor(
            appCommon: AppCommon, 
            protected animationService: AnimationService,
            protected authService: AuthService
        ){
            super(appCommon)
            this.list();
        }

        list() {
            this.animationService.list().then((res) => {
                this.animations = res.data;
            })
        }

        // showOptions(event: MouseEvent, animationId: string) {
        //     this.selectedAnimationId = animationId;
        //     var target = angular.element(event.currentTarget).parentsUntil('.animation-card');
        //     var position = this.appCommon.$mdPanel.newPanelPosition()
        //         .absolute().withOffsetX(target.offset().left + "px").withOffsetY(target.offset().top + "px");
        //         // .relativeTo(target)
        //         // .addPanelPosition('align-end', 'below');
        //     this.appCommon.$mdPanel.open({
        //         attachTo: angular.element(document.body),
        //         position: position,
        //         templateUrl: '/templates/anim-menu.html',
        //         clickOutsideToClose: true,
        //         escapeToClose: true,
        //         focusOnOpen: false,
        //         zIndex: 2
        //     });
        // };

        delete() {
            if (this.selectedAnimationId) {
                alert(this.selectedAnimationId);
            }
        }
    }
}