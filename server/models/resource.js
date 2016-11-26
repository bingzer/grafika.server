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
        var _this = _super.call(this) || this;
        _this.mime = "image/png";
        _this.id = "thumbnail";
        _this.type = "thumbnail";
        _this.mime = "image/png";
        _this.animationId = animationId;
        return _this;
    }
    return Thumbnail;
}(Resource));
exports.Thumbnail = Thumbnail;
//# sourceMappingURL=resource.js.map