import * as winston from 'winston';
import * as config from '../configs/config';
//import * as restful from '../libs/restful';
import * as mongoose from 'mongoose';
import { Animation } from '../models/animation';
import { User } from '../models/user';

export function initialize(app) {
    winston.debug('Connecting to mongodb');

    mongoose.connect(config.setting.$server.$databaseUrl, (err) => {
        if (!err) {
            winston.info('mongodb [OK]');
        }
        else {
            winston.error('mongodb [FAILED]');
            winston.error(err);
        }
    });
}