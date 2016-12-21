"use strict";
var animation_1 = require("./animation");
var q = require("q");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ServerSync = (function () {
    function ServerSync(userId) {
        this.userId = userId;
        // nothing
    }
    ServerSync.find = function (userId) {
        var defer = q.defer();
        var serverSync = new ServerSync(userId);
        function findAnimations(query) {
            var defer = q.defer();
            animation_1.Animation.find(query, { frames: 0 }).lean().exec(function (err, results) {
                if (err)
                    defer.reject(err);
                else if (!results)
                    defer.reject('not found');
                else {
                    defer.resolve(results);
                }
            });
            return defer.promise;
        }
        findAnimations({ userId: userId, removed: false })
            .then(function (results) {
            serverSync.animations = results;
            return findAnimations({ userId: userId, removed: true });
        })
            .then(function (results) {
            serverSync.tombstones = results;
            defer.resolve(serverSync);
        })
            .catch(function (error) { return defer.reject(error); });
        return defer.promise;
    };
    return ServerSync;
}());
exports.ServerSync = ServerSync;
//# sourceMappingURL=sync.js.map