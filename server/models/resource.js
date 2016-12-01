"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = (function () {
    function Resource(resource) {
        if (resource) {
            this.id = resource._id;
            this.type = resource.type;
        }
    }
    return Resource;
}());
exports.Resource = Resource;
var Thumbnail = (function (_super) {
    __extends(Thumbnail, _super);
    function Thumbnail(animationId) {
        _super.call(this);
        this.mime = "image/png";
        this.id = "thumbnail";
        this.type = "thumbnail";
        this.mime = "image/png";
        this.animationId = animationId;
    }
    return Thumbnail;
}(Resource));
exports.Thumbnail = Thumbnail;
//# sourceMappingURL=resource.js.map