"use strict";
var config = require("../configs/config");
var pkg = require('../../package.json');
function getInfo(req, res, next) {
    var server = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        url: config.setting.$server.$url
    };
    return res.json(server);
}
exports.getInfo = getInfo;
;
//# sourceMappingURL=server.js.map