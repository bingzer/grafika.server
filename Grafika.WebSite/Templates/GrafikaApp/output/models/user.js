var GrafikaApp;
(function (GrafikaApp) {
    var User = (function () {
        function User(payload) {
            if (!payload)
                return;
            this._id = payload._id;
            this.email = payload.email;
            this.username = payload.username;
            this.firstName = payload.given_name || payload.firstName;
            this.lastName = payload.family_name || payload.lastName;
            this.dateCreated = payload.dateCreated;
            this.dateModified = payload.dateModified;
            this.active = payload.active;
            this.roles = payload.roles;
            this.prefs = payload.prefs;
            this.subscriptions = payload.subscriptions;
            this.local = payload.local;
            this.google = payload.google;
            this.facebook = payload.facebook;
        }
        User.prototype.getDisplayName = function () {
            if (this.firstName && this.lastName)
                return this.firstName + ' ' + this.lastName;
            else
                return this.email;
        };
        User.prototype.hasRoles = function (names) {
            var roles = [];
            if (angular.isString(names))
                roles.push(names);
            else
                roles = names;
            var anyRole = false;
            for (var i = 0; i < this.roles.length; i++) {
                for (var j = 0; j < roles.length; j++) {
                    if (this.roles[i] == roles[j])
                        anyRole = true;
                    if (anyRole)
                        break;
                }
                if (anyRole)
                    break;
            }
            return anyRole;
        };
        return User;
    }());
    GrafikaApp.User = User;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/models/user.js.map