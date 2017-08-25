module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export class BaseController extends Base {
                public static $inject = ['appCommon'];
                constructor(public appCommon: AppCommon) {
                    super(appCommon)
                }
            }
        }
    }
}