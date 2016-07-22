import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ILocalUserAnimation {
    _id: string | any,
    animationIds: string[],
    dateModified: number,
    dateCreated: number,
    animations: Grafika.IAnimation[]
}

export interface IUserAnimation extends mongoose.Document {
    _id: string | any,
    animationIds: string[],
    dateModified: number,
    dateCreated: number
}

export const UserAnimationSchema = new mongoose.Schema({
    _id               : { type: String, required: true },
    animationIds      : { type: [String] },
    dateModified      : Number,
    dateCreated       : Number
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var UserAnimation = <restful.IModel<IUserAnimation>> restful.model('userAnimations', UserAnimationSchema);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createOrUpdateUserAnimation(userId: string, animationId: string, callback?: (err: any, res: IUserAnimation) => void) {
    UserAnimation.findById(userId, (err, userAnimation) => {
        if (!userAnimation) {
            let userAnim = { _id: userId, animations: [ animationId ], dateModified: Date.now(), dateCreated: Date.now() };
            UserAnimation.create(userAnim, (err, res) => callback(err, res));
        }
        else {
            if (!err) {
                // update
                userAnimation.dateModified = Date.now();
                userAnimation.save();
            }
            callback(err, userAnimation);
        }
    });
}

function deleteUserAnimation(userId: string, animationId: string, callback?: (err: any) => void) {
    UserAnimation.findById(userId, (err, userAnimation) => {
        let i = 0;
        for(; i < userAnimation.animationIds.length; i++) {
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

export { UserAnimation, createOrUpdateUserAnimation, deleteUserAnimation };