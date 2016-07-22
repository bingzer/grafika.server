import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

export interface IUserAnimation extends mongoose.Document {
    _id: string | any,
    animations: string[],
    dateModified: number,
    dateCreated: number
}

export const UserAnimationSchema = new mongoose.Schema({
    _id             : { type: String, required: true },
    animations      : { type: [String] },
    dateModified    : Number,
    dateCreated     : Number
});

var UserAnimation = <restful.IModel<IUserAnimation>> restful.model('userAnimations', UserAnimationSchema);

function createOrUpdateUserAnimation(userId: string, animationId: string, callback?: (err: any, res: IUserAnimation) => void) {
    UserAnimation.findById(userId, (err, userAnimation) => {
        if (!userAnimation) {
            let userAnim = { _id: userId, animations: [ animationId ], dateModified: Date.now(), dateCreated: Date.now() };
            UserAnimation.create(userAnim, (err, res) => callback(err, res));
        }
        else {
            if (!err) {
                userAnimation.animations.push(animationId);
                userAnimation.dateModified = Date.now();
                userAnimation.save();
            }
            callback(err, userAnimation);
        }
    });
}

function  deleteUserAnimation(userId: string, animationId: string, callback?: (err: any) => void) {
    UserAnimation.findById(userId, (err, userAnimation) => {
        let i = 0;
        for(; i < userAnimation.animations.length; i++) {
            if (userAnimation.animations[i] == animationId) {
                break;
            }
        }

        userAnimation.animations.splice(i, 1);
        userAnimation.dateModified = Date.now();
        userAnimation.save();
        callback(err);
    });
}

export { UserAnimation, createOrUpdateUserAnimation, deleteUserAnimation };