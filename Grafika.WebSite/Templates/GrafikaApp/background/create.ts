module GrafikaApp {

    export class BackgroundCreateController extends DialogController {
        name: string;
        width: number = 800;
        height: number = 450;
        isPublic: boolean;
        orientations: string[] = ['Landscape', 'Portrait'];
        orientation: string = 'Landscape';
        
        public static $inject = ['appCommon', 'authService', 'backgroundService'];
        constructor(
            appCommon: AppCommon, 
            private authService: AuthService,
            private backgroundService: BackgroundService){
            super(appCommon);
            this.isPublic = this.authService.getUser().prefs.drawingIsPublic;
            this.width = this.appCommon.appConfig.defaultAnimationWidth;
            this.height = this.appCommon.appConfig.defaultAnimationHeight;
        }

        create() {
            let background = {
                name: this.name,
                isPublic: this.isPublic
            } as Grafika.IBackground;

            if (this.orientation === 'Landscape'){
                background.width = this.width;
                background.height = this.height;
            }
            else {
                background.width = this.height;
                background.height = this.width;
            }
            
            this.backgroundService.create(background).then((res) => {
                this.close();
                this.appCommon.showLoadingModal().then(() => {
                    let background = res.data;
                    this.appCommon.$state.go('drawing', { _id: background._id });
                })
            })
        }

    }
}