import restful = require('../libs/restful');
import * as mongoose from 'mongoose';

export interface IAnimation extends restful.mongoose.Document {
    _id: string;

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

export const Animation = mongoose.model<IAnimation>('animations', AnimationSchema);