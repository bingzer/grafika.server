var GrafikaApp;
(function (GrafikaApp) {
    var ImageData = (function () {
        function ImageData(name, size, mime, blob) {
            this.name = name;
            this.size = size;
            this.mime = mime;
            this.blob = blob;
            // nothing
        }
        ImageData.prototype.getBlob = function () {
            return this.blob();
        };
        return ImageData;
    }());
    GrafikaApp.ImageData = ImageData;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/models/image-data.js.map