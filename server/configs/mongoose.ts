import * as winston from 'winston';
import * as config from '../configs/config';
import * as restful from '../libs/restful';

export function initialize() {
    winston.debug('Connecting to mongodb');
    restful.mongoose.connect(config.setting.$server.$databaseUrl, (err) => {
        if (!err) winston.info('mongodb [OK]');
        else {
            winston.error('mongodb [FAILED]');
            winston.error(err);
        }
    });
}