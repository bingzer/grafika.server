module GrafikaApp {
    export class ImageUploadOptions {
        previewWidth: number;
        previewHeight: number;
        actualWidth: number;
        actualHeight: number;
        onUpload: (data: any) => ng.IPromise<any>;
        onClosed: () => void;
    }

    export class ImageUploaderDirective implements ng.IDirective {
        restrict = 'A';
        scope = {
            previewWidth: '=',
            previewHeight: '=',
            actualWidth: '=',
            actualHeight: '=',
            onUpload: '&',
            onClosed: '&'
        };
        link = (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctr: any) => {
            elem.bind('click', () => {						
                this.appCommon.$mdDialog.show({
                    controller: ImageUploaderController,
                    controllerAs: 'vm',
                    templateUrl: 'app/directives/image-uploader.html',
                    parent: angular.element(document.body),
                    locals: { uploadOptions: scope }
                });
            });
        };        
        
        constructor(private appCommon: AppCommon) {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = (appCommon: AppCommon) => new ImageUploaderDirective(appCommon);
            directive.$inject = ['appCommon'];
            return directive;
        }
    }

    function ImageUploaderController(scope: ng.IScope, appCommon: AppCommon, uploadOptions: ImageUploadOptions) {
        let vm: any = this;
        
        vm.message = '';			
        vm.preview = (evt) => {
            vm.uploading = true;
            let fileReader = new FileReader();
            let file = (<HTMLInputElement> $('#image-file')[0]).files[0];
            fileReader.onload = () => {
                if (!file) return;
                vm.message = 'Resizing...';
                let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#image-canvas')[0];
                let context = canvas.getContext('2d');
                let canvasWidth: number = $('#image-canvas').width();		
                let canvasHeight: number = $('#image-canvas').height();		
                let img = new Image();
                img.onload = () => {
                    context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    var data = { name: file.name, size: file.size, mime: file.type, getBlob: getCanvasBlob };
                    vm.upload(data);
                };
                if (!img.src) {
                    img.src = fileReader.result;
                }
            };
            fileReader.readAsDataURL(file);
        };			
        vm.upload = (imageData) => {
            vm.message = 'Uploading...';
            vm.uploading = false;
            return uploadOptions.onUpload({$imageData: imageData})
                .then(() => vm.message = 'Successfully uploaded')
                .catch((err) => vm.message = 'Unable to upload. ' + appCommon.formatErrorMessage(err))
                .finally(() => vm.uploading = false );
        };
        vm.close = () => {
            if (uploadOptions.onClosed) uploadOptions.onClosed();
            appCommon.$mdDialog.hide();
        };
        
        function initialize(){
            appCommon.$log.log('Checking canvas', null, 'image-uploader');
            if ($('#image-canvas').length == 0) return;
            
            $('#image-canvas').attr('width', uploadOptions.actualWidth)
                            .attr('height', uploadOptions.actualHeight)
                            .css('width', uploadOptions.previewWidth)
                            .css('height', uploadOptions.previewHeight);
            appCommon.$interval.cancel(checkCanvas);
            checkCanvas = undefined;
            vm.canvasReady = true;
        };

        function getCanvasBlob() {
            let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#image-canvas')[0];
            let binary = atob(canvas.toDataURL("image/png", 100).split(',')[1]);
            let array = [];
            for(let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/png'});
        }
        
        // wait for canvas to initialized
        let checkCanvas = appCommon.$interval(initialize, 1000);
    }
}