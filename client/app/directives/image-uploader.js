var GrafikaApp;
(function (GrafikaApp) {
    var ImageUploadOptions = (function () {
        function ImageUploadOptions() {
        }
        return ImageUploadOptions;
    }());
    GrafikaApp.ImageUploadOptions = ImageUploadOptions;
    var ImageUploaderDirective = (function () {
        function ImageUploaderDirective(appCommon) {
            var _this = this;
            this.appCommon = appCommon;
            this.restrict = 'A';
            this.scope = {
                previewWidth: '=',
                previewHeight: '=',
                actualWidth: '=',
                actualHeight: '=',
                onUpload: '&',
                onClosed: '&'
            };
            this.link = function (scope, elem, attrs, ctr) {
                elem.bind('click', function (evt) {
                    var useFullScreen = (_this.appCommon.$mdMedia('sm') || _this.appCommon.$mdMedia('xs'));
                    _this.appCommon.$mdDialog.show({
                        fullscreen: useFullScreen,
                        controller: ImageUploaderController,
                        controllerAs: 'vm',
                        parent: angular.element(document.body),
                        templateUrl: 'app/directives/image-uploader.html',
                        locals: { uploadOptions: scope }
                    });
                });
            };
        }
        ImageUploaderDirective.factory = function () {
            var directive = function (appCommon) { return new ImageUploaderDirective(appCommon); };
            directive.$inject = ['appCommon'];
            return directive;
        };
        return ImageUploaderDirective;
    }());
    GrafikaApp.ImageUploaderDirective = ImageUploaderDirective;
    function ImageUploaderController(scope, appCommon, uploadOptions) {
        var vm = this;
        vm.message = '';
        vm.preview = function (evt) {
            vm.uploading = true;
            var fileReader = new FileReader();
            var file = $('#image-file')[0].files[0];
            fileReader.onload = function () {
                if (!file)
                    return;
                vm.message = 'Resizing...';
                var canvas = $('#image-canvas')[0];
                var context = canvas.getContext('2d');
                var canvasWidth = $('#image-canvas').width();
                var canvasHeight = $('#image-canvas').height();
                var img = new Image();
                img.onload = function () {
                    context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    var data = new GrafikaApp.ImageData(file.name, file.size, file.type, function () { return getCanvasBlob(); });
                    vm.upload(data);
                };
                if (!img.src) {
                    img.src = fileReader.result;
                }
            };
            fileReader.readAsDataURL(file);
        };
        vm.upload = function (imageData) {
            vm.message = 'Uploading...';
            vm.uploading = false;
            return uploadOptions.onUpload({ $imageData: imageData })
                .then(function () { return vm.message = 'Successfully uploaded'; })
                .catch(function (err) { return vm.message = 'Unable to upload. ' + appCommon.formatErrorMessage(err); })
                .finally(function () { return vm.uploading = false; });
        };
        vm.close = function () {
            if (uploadOptions.onClosed)
                uploadOptions.onClosed();
            appCommon.$mdDialog.hide();
        };
        function initialize() {
            appCommon.$log.log('Checking canvas', null, 'image-uploader');
            if ($('#image-canvas').length == 0)
                return;
            $('#image-canvas').attr('width', uploadOptions.actualWidth)
                .attr('height', uploadOptions.actualHeight)
                .css('width', uploadOptions.previewWidth)
                .css('height', uploadOptions.previewHeight);
            appCommon.$interval.cancel(checkCanvas);
            checkCanvas = undefined;
            vm.canvasReady = true;
        }
        ;
        function getCanvasBlob() {
            var canvas = $('#image-canvas')[0];
            var binary = atob(canvas.toDataURL("image/png", 100).split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: 'image/png' });
        }
        var checkCanvas = appCommon.$interval(initialize, 1000);
    }
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=image-uploader.js.map