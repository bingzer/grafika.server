import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

export interface IAnimation extends Grafika.IAnimation, mongoose.Document {
}

export const AnimationSchema = new mongoose.Schema({
    localId      : { type: String },

    name         : { type: String, required: true },
    description  : String,

    timer        : Number,
    width        : { type: Number, required: true },
    height       : { type: Number, required: true },

    dateCreated  : { type: Number, required: true },
    dateModified : { type: Number, required: true },

    views        : Number,
    rating       : Number,
    category     : String,

    isPublic     : { type: Boolean, default: false },
    author       : String,
    userId       : { type: String, required: true },

    frames       : { type: [], select: false }
});

var Animation = <restful.IModel<IAnimation>> restful.model('animations', AnimationSchema);
Animation.methods(['get', 'put', 'post', 'delete']);
Animation.before('post', (req, res, next) => {
    // check for date time
    var now = Date.now();
    if (!req.body.dateCreated) req.body.dateCreated = now;
    if (!req.body.dateModified) req.body.dateModified = now;
    if (!req.body.userId) req.body.userId = req.user._id;
    delete req.body._id;
    
    next();
});
// -- Frames
Animation.route('frames', {
    detail: true,
    handler: (req, res, next) => {
        if (req.method === 'GET') {
            Animation.findOne({_id: req.params.id}, "frames").lean().exec((err, result) =>{
                res.send(result.frames);
            });
        }
        else if (req.method == 'POST') {
            Animation.findOne({_id: req.params.id}, (err, result) => {
                result.frames = req.body;
                result.save();
                res.sendStatus(201);
            });
        }
        else next(400);
    }
});
// -- Resources
Animation.route('resources', {
    detail: true,
    handler: (req, res, next) => {
        next();
    }
});

export { Animation };