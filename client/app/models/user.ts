module GrafikaApp {
    export class User implements Grafika.IUser {
        _id: any | string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        dateCreated: number;
        dateModified: number;
        active: boolean;
        roles: string[];

        prefs: Grafika.IUserPreference;
        
        constructor(payload?: any) {
            if (!payload) return;
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
        }

        getDisplayName(): string {
            if (this.firstName && this.lastName) return this.firstName + ' ' + this.lastName;
            else return this.email;
        }
        
        hasRoles(names: string | [string]): boolean {
            var roles = [];
            if (angular.isString(names))
                roles.push(names);
            else roles = <[string]> names;
            
            var anyRole = false;
            for (var i = 0; i < this.roles.length; i++) {
                for (var j = 0; j < roles.length; j++) {
                    if (this.roles[i] == roles[j])
                        anyRole = true;
                    if (anyRole) break;
                }
                if (anyRole)
                    break;
            }
            return anyRole;
        }
    }
}