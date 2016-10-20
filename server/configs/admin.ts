import * as winston from 'winston';
import * as q from 'q';

import { ensureAdminExists } from '../models/user';

export function initialize(app): q.IPromise<any>{ 
    return ensureAdminExists().then(() => {
        winston.info('Admin [OK]');
        return q.when(true);
    });
}