"use strict";
var animation_1 = require("../models/animation");
function remove(req, res, next) {
    animation_1.Animation.findByIdAndUpdate(req.params._id, { removed: true }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        return res.sendStatus(200);
    });
}
exports.remove = remove;
//# sourceMappingURL=animation.js.map