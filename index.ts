import * as express from 'express';
import * as compression from 'compression'
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as methodOverride from 'method-override';
import * as winston from 'winston';
import * as passport from 'passport';
import * as cors from 'cors';
import * as q from 'q';

import * as config from './server/configs/config'
import * as mongooseConfig from './server/configs/mongoose';
import * as routeConfig from './server/configs/routes';
import * as passportConfig from './server/configs/passport';
import * as adminConfig from './server/configs/admin';

let onInitializeFunction: Function;

const app = express();

export const server = app.listen(process.env.PORT || 3000, () => {
    winston.info('Grafika API version : ' + config.setting.$version);
    winston.info('   Debug : ' + config.setting.$debug);
	winston.info('Grafika Api is starting at port ' + server.address().port);
	winston.info('   URL address : ' + config.setting.$server.$url + ' (' + server.address().address + ')');
    
    initialize(app)
        .then(() => config.setting.initialize(app))
        .then(() => routeConfig.initialize(app))
        .then(() => mongooseConfig.initialize(app))
        .then(() => passportConfig.initialize(app))
        .then(() => adminConfig.initialize(app))
        .then(() => {
        })
        .then(() => {
            winston.info('Server [OK]');
            winston.info('Server is now ready taking requests');
        })
        .catch((err) => {
            winston.error('Server [FAILED]');
            winston.error(err);
        })
        .finally(() => {
            if (onInitializeFunction)
                onInitializeFunction();
        });
});

function initialize(app) : q.Promise<any> {
    let defer = q.defer();

    setTimeout(() => {
        app.use(cors({ methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE" ] }));
        app.use(compression());
        app.use(unless(/animations\/.+\/frames/g, bodyParser.urlencoded({ extended: true })));
        app.use(unless(/animations\/.+\/frames/g, bodyParser.json({ limit: '5mb'})));
        
        app.use('/animations/:id/frames', cors(), bodyParser.raw({type: '*/*', limit: '5mb'}));

        app.use(methodOverride());
        app.use(morgan('dev'));
    
        app.use(passport.initialize());
        winston.info('Middlewares [OK]');
        defer.resolve();
    }, 100);


    return defer.promise;
}

export function onInitialized(done: Function) {
    onInitializeFunction = done;
}

let unless = (path, middleware) => {
    return function(req, res, next) {
        if (req.path.match(path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};