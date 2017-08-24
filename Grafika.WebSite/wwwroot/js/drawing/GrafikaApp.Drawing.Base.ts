module GrafikaApp {
    export module Drawing {
        export class Base {
            public static $inject = ['appCommon'];
            constructor(protected appCommon: AppCommon) {
                // nothing
            }
        }
    }
}