import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as methodOverride from 'method-override';
import * as winston from 'winston';
import * as passport from 'passport';

import * as mongooseConfig from './server/configs/mongoose';
import * as routeConfig from './server/configs/routes';
import * as passportConfig from './server/configs/passport';
import * as config from './server/configs/config'

let app = express();

var server = app.listen(process.env.PORT || 3000, () => {
    winston.info('Grafika version : ' + config.setting.$version);
	winston.info('Server is starting at port ' + server.address().port);
	winston.info('   URL address (config): ' + config.setting.$server.$url);

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(morgan('dev'));

    app.use(session({ secret: config.setting.$client.$sessionSecret, name: 'grafika.session', resave: true, saveUninitialized: true })); // session secret    
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    
    config.setting.validate();

    routeConfig.initialize(app);
    mongooseConfig.initialize(app);
    passportConfig.initialize();
    
    app.use("/", express.static(__dirname + "/client"));
    app.all('/*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('index.html', { root: __dirname + '/client' });
    });

    winston.info('Server is started');
});