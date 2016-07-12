"use strict";
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var winston = require('winston');
var passport = require('passport');
var config = require('./server/configs/config');
var mongooseConfig = require('./server/configs/mongoose');
var routeConfig = require('./server/configs/routes');
var app = express();
var server = app.listen(process.env.PORT || 3000, function () {
    winston.info('Grafika version : ' + config.setting.$version);
    winston.info('Server is starting at port ' + server.address().port);
    winston.info('   URL address (config): ' + config.setting.$server.$url);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(morgan('dev'));
    app.use(session({ secret: config.setting.$client.$sessionSecret, name: 'grafika.session', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    config.setting.validate();
    mongooseConfig.initialize();
    routeConfig.initialize(app);
    app.use("/", express.static(__dirname + "/client"));
    app.all('/*', function (req, res, next) {
        res.sendFile('index.html', { root: __dirname + '/client' });
    });
    winston.info('Server is started');
});
//# sourceMappingURL=index.js.map