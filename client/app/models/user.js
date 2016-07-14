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
            if (!names || names.length == 0)
                names = ['user'];
            var anyRole = false;
            for (var i = 0; i < this.roles.length; i++) {
                for (var j = 0; j < names.length; j++) {
                    if (this.roles[i] == names[j])
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