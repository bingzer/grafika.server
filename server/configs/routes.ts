import * as express from 'express';
import * as expressJwt from 'express-jwt';
import * as mongoose from 'mongoose';
import * as winston from 'winston';

import * as accountController from '../controllers/accounts';
import * as resourcesController from '../controllers/resources';
import * as config from '../configs/config';
import { Animation } from '../models/animation';
import { User } from '../models/user';

//////////////////////////////////////////////////////////////////////////////////////////////////

let SECRET = config.setting.$server.$superSecret;

/** find token from Http Request. Header/Query, etc... */
function findToken(req: express.Request) : string {
    if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] === 'Bearer')
        return req.headers['authorization'].split(' ')[1];
    else if (req.query && req.query.token)
        return req.query.token;
    return null;
}

/** Make sure is logged in via session */
function useSession(req: express.Request, res: express.Response, next: express.NextFunction) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    else res.send(401);
};

function extractUser(req: any, res: express.Response, next: express.NextFunction) {
    if (!req.isAuthenticated())
        expressJwt({ secret: SECRET, credentialsRequired: false, getToken: findToken })(req, res, next);
    else 
        next();
}

/** Authenticate using jwt token */
function useJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
    return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
};

/** Authenticate using jwt token only if it's not authenticated yet */
function useSessionOrJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.isAuthenticated())
        return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
    else next();
}

/** Check animation access */
function useAnimAccess(req: any, res: express.Response, next: express.NextFunction) {
    var animId = new mongoose.Types.ObjectId(req.params._id || req.params.animationId);
    var userId = (req.user && req.user._id) ? new mongoose.Types.ObjectId(req.user._id) : undefined;
    var queryAdmin = null;
    var query = null;
    var isAdmin = isAdministrator(req);
    if (isAdmin) {
        queryAdmin = { _id: animId };
    }        
    else {
        query = { $or: [
            { $and: [ { _id: animId }, { userId: userId } ] },
            { $and: [ { _id: animId }, { isPublic: true } ] }
        ]};
    }
    return Animation.findOne(query || queryAdmin, { _id: 1, userId: 1}, (err, result) => {
        if (err) return next(err);
        if (result) {
            // Enforce for READ-ONLY access
            // only that user and an administrator can do PUT/POST/DELETE
            // others can only GET 
            if (req.method != 'GET'){
                // comapre the user id
                if (!userId || result.userId.toString() !== userId.toString() && !isAdmin){
                    return next(401);
                }
            }
            
            return next();
        }
        else return next(401);  // not authorized
    });
}

function useAdminAccess(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!isAdministrator(req)) return next(401);
    return next();
}

/** Simply redirect to '/' */
function redirectHome(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.redirect('/');
}

function isAdministrator(req: any) {
    return req.user && req.user.roles && req.user.roles.indexOf('administrator') > -1;
}

function handleErrors(err, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err) {
		var status = 500;
		var msg    = undefined;
		var stack  = err.stack;
		delete err.stack;
		
		if (typeof err == 'number')
			status = err;
		else if (typeof err == 'string'){
			status = 400;
			msg = err;
		}
		else if (err.status){
			status = err.status;
			msg    = err.msg || err.message;
		}
		else {
			msg = 'This is our fault, will be checking on this';
		}
		res.status(status).send(msg);
		
		winston.error('HTTP Error. Status Code=' + status + (msg ? '  msg=' + msg : ''), stack);
    }
    else next();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function initialize(app) {    
    // app.get('/api/accounts/google', accountController.googleLogin);
    // app.get('/api/accounts/google/callback', accountController.googleCallback, redirectHome);
    // app.get('/api/accounts/facebook', accountController.facebookLogin);
    // app.get('/api/accounts/facebook/callback', accountController.facebookCallback, redirectHome);
    // app.get('/api/accounts/disqus', useSessionOrJwt, accountController.disqusToken);
    
    app.post('/api/accounts', accountController.login)
    app.post('/api/accounts/logout', accountController.logout);
    app.post('/api/accounts/authenticate', accountController.authenticate);
    app.post('/api/accounts/pwd', useSession, accountController.changePassword);
    app.post('/api/accounts/pwd/reset', accountController.resetPassword);
    app.post('/api/accounts/register', accountController.register);
    
    // ---------------- Animation -----------------------------//
    app.get('/api/animations');  // List => use nothing
    app.post('/api/animations', useSessionOrJwt); // create
    app.get('/api/animations/:_id', extractUser, useAnimAccess); // view
    app.put('/api/animations/:_id', useSessionOrJwt, useAnimAccess); // update
    app.delete('/api/animations/', useSessionOrJwt, useAnimAccess); // delete
    app.get('/api/animations/:_id/frames', extractUser, useAnimAccess); // get frames
    app.post('/api/animations/:_id/frames', useSessionOrJwt, useAnimAccess);

    // ---------------- Thumbnail -----------------------------//
    app.get('/api/animations/:animationId/thumbnail', /* extractUser, useAnimAccess, */ resourcesController.getThumbnail);
    app.post('/api/animations/:animationId/thumbnail', useSessionOrJwt, useAnimAccess, resourcesController.createThumbnailSignedUrl);
    
    // --------------- Restful Registeration -------------------------//
    User.register(app, '/api/users');
    Animation.register(app, '/api/animations');

    // --------------- Error handlers -------------------------//
    app.use(handleErrors);

    winston.info('Routes [OK]');
}