"use strict";
var mongoose = require('mongoose');
var restful = require('../libs/restful');
exports.UserAnimationSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    animationIds: { type: [String] },
    dateModified: Number,
    dateCreated: Number
});
var UserAnimation = restful.model('userAnimations', exports.UserAnimationSchema);
exports.UserAnimation = UserAnimation;
function createOrUpdateUserAnimation(userId, animationId, callback) {
    UserAnimation.findById(userId, function (err, userAnimation) {
        if (!userAnimation) {
            var userAnim = { _id: userId, animations: [animationId], dateModified: Date.now(), dateCreated: Date.now() };
            UserAnimation.create(userAnim, function (err, res) { return callback(err, res); });
        }
        else {
            if (!err) {
                userAnimation.dateModified = Date.now();
                userAnimation.save();
            }
            callback(err, userAnimation);
        }
    });
}
exports.createOrUpdateUserAnimation = createOrUpdateUserAnimation;
function deleteUserAnimation(userId, animationId, callback) {
    UserAnimation.findById(userId, function (err, userAnimation) {
        var i = 0;
        for (; i < userAnimation.animationIds.length; i++) {
            if (userAnimation.animationIds[i] == animationId) {
                break;
            }
        }
        userAnimation.animationIds.splice(i, 1);
        userAnimation.dateModified = Date.now();
        userAnimation.save();
        callback(err);
    });
}
exports.deleteUserAnimation = deleteUserAnimation;
//# sourceMappingURL=user-animation.js.map