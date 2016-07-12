"use strict";
var restful = require('../libs/restful');
exports.AnimationSchema = new restful.mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    timer: Number,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now, required: true },
    dateModified: { type: Date, default: Date.now, required: true },
    views: Number,
    rating: Number,
    category: String,
    isPublic: { type: Boolean, default: false },
    author: String,
    userId: { type: String, required: true },
    frames: { type: [Array], select: false }
});
exports.Animation = restful.mongoose.model('animations', exports.AnimationSchema);
//# sourceMappingURL=animation.js.map