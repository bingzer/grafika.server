module GrafikaApp {
    export class AnimationListController extends BaseController {
        paging: Paging;
        animations: Animation[];
        animationSorts: any[];
        selectedAnimationId: string;
        hasMore: boolean = true;
        busy: boolean = false;

        public static $inject = ['appCommon', 'animationService', 'authService' ];
        constructor(
            appCommon: AppCommon, 
            protected animationService: AnimationService,
            protected authService: AuthService
        ){
            super(appCommon)

            this.animationSorts = appCommon.appConfig.animationSorts;
            this.paging = this.createPaging();
            this.list();
        }

        list(append?: boolean) {
            if (!append) this.paging.skip = 0;

            this.busy = true;
            this.animationService.list(this.paging).then((res) => {
                if (!append) this.animations = res.data;
                else this.animations = this.animations.concat(res.data);

                this.busy = false;
                this.hasMore = res.data.length >= this.paging.limit;
                if (this.hasMore)
                    this.paging = this.paging.next();
            });
        }

        canEdit() {
            return false;
        }

        canDelete() {
            return false;
        }

        protected createPaging() : Paging {
            return new Paging({ isPublic: true, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: this.appCommon.appConfig.animationSorts[0].key });
        }
    }
}