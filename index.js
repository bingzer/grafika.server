"use strict";
var express = require('express');
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
var onInitializeFunction;
var app = express();
exports.server = app.listen(process.env.PORT || 3000, function () {
    winston.info('Grafika API version : ' + config.setting.$version);
    winston.info('   Debug : ' + config.setting.$debug);
    winston.info('Grafika Api is starting at port ' + exports.server.address().port);
    winston.info('   URL address : ' + config.setting.$server.$url + ' (' + exports.server.address().address + ')');
    initialize(app)
        .then(function () { return config.setting.initialize(app); })
        .then(function () { return routeConfig.initialize(app); })
        .then(function () { return mongooseConfig.initialize(app); })
        .then(function () { return passportConfig.initialize(app); })
        .then(function () { return adminConfig.initialize(app); })
        .then(function () {
    })
        .then(function () {
        winston.info('Server [OK]');
        winston.info('Server is now ready taking requests');
    })
        .catch(function (err) {
        winston.error('Server [FAILED]');
        winston.error(err);
    })
        .finally(function () {
        if (onInitializeFunction)
            onInitializeFunction();
    });
});
function initialize(app) {
    var defer = q.defer();
    setTimeout(function () {
        app.use(unless(/animations\/.+\/frames/g, bodyParser.urlencoded({ extended: true })));
        app.use(unless(/animations\/.+\/frames/g, bodyParser.json({ limit: '5mb' })));
        app.use('/animations/:id/frames', bodyParser.text({ type: '*/*', limit: '5mb' }));
        app.use(methodOverride());
        app.use(morgan('dev'));
        app.use(cors());
        app.use(passport.initialize());
        winston.info('Middlewares [OK]');
        defer.resolve();
    }, 100);
    return defer.promise;
}
function onInitialized(done) {
    onInitializeFunction = done;
}
exports.onInitialized = onInitialized;
var unless = function (path, middleware) {
    return function (req, res, next) {
        if (req.path.match(path)) {
            return next();
        }
        else {
            return middleware(req, res, next);
        }
    };
};
//# sourceMappingURL=index.js.map