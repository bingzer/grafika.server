import * as winston from 'winston';
import * as mongoose from 'mongoose';
import * as q from 'q';

import * as config from '../configs/config';

export function initialize() {
    winston.debug('Connecting to MongoDB'); 
    const connOption = { 
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } 
    };
    const instance = mongoose.connect(config.setting.$server.$databaseUrl, connOption, (err) => {
        if (!err) {
            winston.info('MongoDB [OK]');
            winston.info('   Version: ' + instance.version);
        }
        else winston.error('MongoDB [ERROR]', err);
    });
    instance.Promise = q.Promise;
}