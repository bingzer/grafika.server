var GrafikaApp;
(function (GrafikaApp) {
    var User = (function () {
        function User() {
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
//# sourceMappingURL=user.js.map