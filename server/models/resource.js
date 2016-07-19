"use strict";
var Resource = (function () {
    function Resource(resource) {
        if (resource) {
            this._id = resource._id;
            this.animationId = resource.animationId;
            this.mime = resource.mime;
        }
    }
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map