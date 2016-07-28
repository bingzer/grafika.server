import * as winston from 'winston';
import * as mongoose from 'mongoose';
import * as q from 'q';

import * as config from '../configs/config';

export function initialize(app) {
    let defer = q.defer();

    winston.debug('Connecting to mongodb');
    mongoose.connect(config.setting.$server.$databaseUrl, (err) => {
        if (err) {
            winston.error('mongodb [FAILED]');
            defer.reject(err);
        }
        else {
            winston.info('mongodb [OK]');
            defer.resolve();
        }
    });

    return defer.promise;
}