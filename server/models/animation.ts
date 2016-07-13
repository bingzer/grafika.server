import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

export interface IAnimation extends mongoose.Document {
    name: string;
    description: string;

    timer: number;
    width: number;
    height: number;

    dateCreated: Date;
    dateModified: Date;

    views: number;
    rating: number;
    category: string;

    isPublic: boolean;
    author: string;
    userId: string;

    frames: any[];
}

export const AnimationSchema = new mongoose.Schema({
    name         : { type: String, required: true },
    description  : String,

    timer        : Number,
    width        : { type: Number, required: true },
    height       : { type: Number, required: true },

    dateCreated  : { type: Date, default: Date.now, required: true },
    dateModified : { type: Date, default: Date.now, required: true },

    views        : Number,
    rating       : Number,
    category     : String,

    isPublic     : { type: Boolean, default: false },
    author       : String,
    userId       : { type: String, required: true },

    frames       : { type: [Array], select: false }
});

var Animation = <mongoose.Model<IAnimation>> restful.model('animations', AnimationSchema);
Animation.methods(['get', 'put', 'post', 'delete']);
Animation.before('post', function (req, res, next) {
    // check for date time
    if (!req.body.dateCreated) req.body.dateCreated = Date.now();
    if (!req.body.dateModified) req.body.dateModified = Date.now();
    if (!req.body.userId) req.body.userId = req.user._doc._id;
    
    next();
});
// -- Frames
Animation.route('frames', {
    detail: true,
    handler: function (req, res, next) {
        if (req.method === 'GET') {
            Animation.findOne({_id: req.params.id}, "frames").lean().exec(function (err, result){
                res.send(result.frames);
            });
        }
        else if (req.method == 'POST') {
            Animation.findOne({_id: req.params.id}, function (err, result) {
                result.frames = req.body;
                result.save();
                res.send(201);
            });
        }
        else next(400);
    }
});
// -- Resources
Animation.route('resources', {
    detail: true,
    handler: function (req, res, next) {
        next();
    }
});

export { Animation };