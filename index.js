"use strict";
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var winston = require('winston');
var passport = require('passport');
var cors = require('cors');
var q = require('q');
var config = require('./server/configs/config');
var mongooseConfig = require('./server/configs/mongoose');
var routeConfig = require('./server/configs/routes');
var passportConfig = require('./server/configs/passport');
var adminConfig = require('./server/configs/admin');
var app = express();
exports.server = app.listen(process.env.PORT || 3000, function () {
    winston.info('Grafika version : ' + config.setting.$version);
    winston.info('Server is starting at port ' + exports.server.address().port);
    winston.info('   URL address : ' + config.setting.$server.$url + ' (' + exports.server.address().address + ')');
    initialize(app)
        .then(function () { return config.setting.initialize(app); })
        .then(function () { return routeConfig.initialize(app); })
        .then(function () { return mongooseConfig.initialize(app); })
        .then(function () { return passportConfig.initialize(app); })
        .then(function () { return adminConfig.initialize(app); })
        .then(function () {
        app.use("/", express.static(__dirname + "/client"));
        app.all('/api/*', function (req, res, next) {
            res.sendStatus(404);
        });
        app.all('/*', function (req, res, next) {
            res.sendFile('index.html', { root: __dirname + '/client' });
        });
    })
        .then(function () {
        winston.info('Server [OK]');
        winston.info('Server is now ready taking requests');
    })
        .catch(function (err) {
        winston.error('Server [FAILED]');
        winston.error(err);
    });
});
function initialize(app) {
    var defer = q.defer();
    setTimeout(function () {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '5mb' }));
        app.use(cookieParser());
        app.use(methodOverride());
        app.use(morgan('dev'));
        app.use(cors());
        app.use(session({ secret: config.setting.$client.$sessionSecret, name: 'grafika.session', resave: true, saveUninitialized: true }));
        app.use(passport.initialize());
        app.use(passport.session());
        winston.info('Middlewares [OK]');
        defer.resolve();
    }, 100);
    return defer.promise;
}
//# sourceMappingURL=index.js.map