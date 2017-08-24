module GrafikaApp {
    export class BackgroundListController extends BaseController {
        paging: Paging;
        backgrounds: Grafika.IBackground[];
        selectedAnimationId: string;
        hasMore: boolean = true;
        busy: boolean = false;

        public static $inject = ['appCommon', 'backgroundService', 'authService' ];
        constructor(
            appCommon: AppCommon, 
            protected backgroundService: BackgroundService,
            protected authService: AuthService
        ){
            super(appCommon)

            this.paging = this.createPaging();
            this.list();
        }

        list(append?: boolean) {
            if (!append) this.paging.skip = 0;

            this.busy = true;
            this.backgroundService.list(this.paging).then((res) => {
                if (!append) this.backgrounds = res.data;
                else this.backgrounds = this.backgrounds.concat(res.data);

                this.hasMore = res.data.length >= this.paging.limit;
                if (this.hasMore)
                    this.paging = this.paging.next();
            })
            .catch((reason) => this.appCommon.toast(this.appCommon.formatErrorMessage(reason)))
            .finally(() => this.busy = false );
        }

        reset() {
            this.paging = this.createPaging();
            this.list();
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