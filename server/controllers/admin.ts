import * as _ from 'underscore';
import * as q from 'q';
import * as winston from 'winston';
import * as mongoose from 'mongoose';
import * as express from 'express';

import * as mailer from '../libs/mailer';
import * as config from '../configs/config';

import { ISync, IServerSync, ServerSync, ILocalSync } from '../models/sync';
import { Animation, IAnimation } from '../models/animation';
import { User, IUser } from '../models/user';

const MAX_COUNT = 25;

export function get(req: express.Request, res: express.Response, next: express.NextFunction) {
	return res.json(getServerInfo());
};

export function listUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
	let sort = createUserSort(req);
	let query = createQuery(req);
	let count = safeParseInt(req.query.count) < MAX_COUNT ? safeParseInt(req.query.count) : MAX_COUNT;
	let page = safeParseInt(req.query.page) < 0 ? 0 : safeParseInt(req.query.page);
	
	User.find(query).limit(count).skip(page).sort(sort).exec((err, result) => {
        if (err) return next(err);
		return res.json(result);
	});
}

export function listAnimations(req: express.Request, res: express.Response, next: express.NextFunction) {
	let sort = createAnimationSort(req);
	let query = createQuery(req);
	let count = safeParseInt(req.query.count) < MAX_COUNT ? safeParseInt(req.query.count) : MAX_COUNT;
	let page = safeParseInt(req.query.page) < 0 ? 0 : safeParseInt(req.query.page);
	
	Animation.find(query).limit(count).skip(page).sort(sort).exec((err, result) => {
        if (err) return next(err);
        res.json(result);
    });
};

export function sendVerificationEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(req.params._id, (err, user) => {
        if (err) return next(err);
		if (!user) return next(404);
		user.activation.hash      = user.generateActivationHash();
		user.activation.timestamp = new Date();
		user.save();
		mailer.sendVerificationEmail(user)
			.then(() => res.sendStatus(200) )
			.catch(next);
	});
}

export function sendResetEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(req.params._id, (err, user) => {
        if (err) return next(err);
		if (!user) return next(404);
		user.activation.hash      = user.generateActivationHash();
		user.activation.timestamp = new Date();
		user.save();
		mailer.sendResetEmail(user)
			.then(() => res.sendStatus(200) )
			.catch(next);
	});
}

export function inactivateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(req.params._id, (err, user) => {
        if (err) return next(err);
		if (!user) return next(404);
		user.active = false;
		user.activation.hash = null;
		user.activation.timestamp = null;
		user.save();
		res.status(200).send();
	});
}

export function activateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(req.params._id, (err, user) => {
        if (err) return next(err);
		if (!user) return next(404);
		user.active = true;
		user.activation.hash = null;
		user.activation.timestamp = null;
		user.save();
		res.status(200).send();
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////
function safeParseInt(num){
	let i = parseInt(num);
	if (isNaN(i)) i = -1;
	return i;
}
function createUserSort(req: any){
	let sort:any = {};
	if (req.query.sort === 'username') 
		sort.username = -1;
	else if (req.query.sort === 'created')
		sort.createdDate = -1;
	sort._id = -1;
	return sort;
}
function createQuery(req){
	let q:any = { };
	
	// search
	if (req.query.query){
		if (req.query.query.indexOf('{') > -1){
			q = JSON.parse(req.query.query)
		}
		else q.$text = { $search: req.query.query };
	}
	
	return q;
}
function createAnimationSort(req){
	let sort:any = {};
	if (req.query.sort === 'rating') 
		sort.rating = -1;
	else if (req.query.sort === 'views')
		sort.views = -1;
	else if (req.query.sort === 'newest')
		sort.modifiedDate = -1;
	sort._id = -1;
	return sort;
}

function getServerInfo(){
	let HIDDEN = '*******';
	let serverConfig = JSON.parse(JSON.stringify(config.setting));
	// hide all important values
	serverConfig.client.sessionSecret=HIDDEN;
	serverConfig.server.superSecret=HIDDEN;
	serverConfig.server.databaseUrl=HIDDEN;
	serverConfig.server.mailPassword=HIDDEN;
	serverConfig.auth.googleSecret=HIDDEN;
	serverConfig.auth.facebookSecret=HIDDEN;
	serverConfig.auth.disqusSecret=HIDDEN;
	serverConfig.auth.awsSecret=HIDDEN;
	return serverConfig;
}