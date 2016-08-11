import * as winston from 'winston';
import * as mongoose from 'mongoose';
import * as q from 'q';

import * as config from '../configs/config';

export function initialize(app) {
    let defer = q.defer();

    winston.debug('Connecting to MongoDB'); 
    const connOption = { 
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } 
    };
    const instance = mongoose.connect(config.setting.$server.$databaseUrl, connOption, (err) => {
        if (err) {
            winston.error('MongoDB [FAILED]');
            defer.reject(err);
        }
        else {
            winston.info('MongoDB [OK]');
            defer.resolve();
        }
    });
    instance.Promise = q.Promise;
    instance.connection.on('error', (err) => {
        winston.error('[Mongoose]', err);
    });

    return defer.promise;
}