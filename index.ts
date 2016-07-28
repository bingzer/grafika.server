import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
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

const app = express();

export const server = app.listen(process.env.PORT || 3000, () => {
    winston.info('Grafika version : ' + config.setting.$version);
	winston.info('Server is starting at port ' + server.address().port);
	winston.info('   URL address : ' + config.setting.$server.$url + ' (' + server.address().address + ')');
    
    initialize(app)
        .then(() => config.setting.initialize(app))
        .then(() => routeConfig.initialize(app))
        .then(() => mongooseConfig.initialize(app))
        .then(() => passportConfig.initialize(app))
        .then(() => {
            app.use("/", express.static(__dirname + "/client"));
            app.all('/api/*', (req, res, next) => {
                res.sendStatus(404);
            });
            app.all('/*', (req, res, next) => {
                res.sendFile('index.html', { root: __dirname + '/client' });
            });
        })
        .then(() => {
            winston.info('Server [OK]');
        })
        .catch((err) => {
            winston.error('Server [FAILED]');
            winston.error(err);
        });
});

function initialize(app) : q.Promise<any> {
    let defer = q.defer();

    setTimeout(() => {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '5mb'}));
        app.use(cookieParser());
        app.use(methodOverride());
        app.use(morgan('dev'));
        app.use(cors());

        app.use(session({ secret: config.setting.$client.$sessionSecret, name: 'grafika.session', resave: true, saveUninitialized: true })); // session secret    
        app.use(passport.initialize());
        app.use(passport.session()); // persistent login sessions

        winston.info('Middlewares [OK]');
        defer.resolve();
    }, 100);


    return defer.promise;
}