import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as methodOverride from 'method-override';

import * as winston from 'winston';
import config = require('./server/configs/config');


var app = express();

var server = app.listen(process.env.PORT || 3000, () => {
    winston.info('Grafika version : ' + config.setting.$version);
    
});