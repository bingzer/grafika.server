"use strict";
var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var methodOverride = require("method-override");
var winston = require("winston");
var passport = require("passport");
var cors = require("cors");
var config = require("./server/configs/config");
var mongooseConfig = require("./server/configs/mongoose");
var routeConfig = require("./server/configs/routes");
var passportConfig = require("./server/configs/passport");
var onInitializeFunction;
var app = express();
exports.server = app.listen(process.env.PORT || 3000, function () {
    winston.info('Grafika API version : ' + config.setting.$version);
    winston.info('   Debug : ' + config.setting.$debug);
    winston.info('Grafika Api is starting at port ' + exports.server.address().port);
    winston.info('   URL address : ' + config.setting.$server.$url + ' (' + exports.server.address().address + ')');
    initialize(app);
    config.setting.initialize();
    routeConfig.initialize(app);
    mongooseConfig.initialize();
    passportConfig.initialize(app);
    winston.info('Server [OK]');
    winston.info('Server is now ready taking requests');
    if (onInitializeFunction)
        onInitializeFunction();
});
function initialize(app) {
    app.use(cors());
    app.use(compression());
    app.use(unless(/animations\/.+\/frames/g, bodyParser.urlencoded({ extended: true })));
    app.use(unless(/animations\/.+\/frames/g, bodyParser.json({ limit: config.setting.$server.$requestLimit })));
    app.use('/animations/:id/frames', bodyParseRaw);
    app.use(methodOverride());
    app.use(morgan('dev'));
    app.use(passport.initialize());
    winston.info('Middlewares [OK]');
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
var bodyParseRaw = function (req, res, next) {
    if (req.header("Content-Encoding") === "deflate")
        return next();
    return bodyParser.raw({ type: '*/*', limit: config.setting.$server.$requestLimit })(req, res, next);
};
//# sourceMappingURL=index.js.map