module GrafikaApp {
    export module Drawing {
        export module Controllers {

            export abstract class DialogController extends BaseController {
                constructor(appCommon: AppCommon) {
                    super(appCommon)
                }

                close(response?: any): ng.IPromise<any> {
                    return this.appCommon.$mdDialog.hide(response);
                }

                cancel() {
                    this.appCommon.$mdDialog.cancel();
                }
            }

        }
    }
}