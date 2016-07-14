module GrafikaApp {
    export class User implements Grafika.IUser {
        _id: any | string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        dateCreated: Date;
        dateModified: Date;
        active: boolean;
        roles: string[];

        getDisplayName(): string {
            if (this.firstName && this.lastName) return this.firstName + ' ' + this.lastName;
            else return this.email;
        }
        
        hasRoles(names: string | [string]): boolean {
            if (!names || names.length == 0) names = ['user'];
            var anyRole = false;
            for (var i = 0; i < this.roles.length; i++) {
                for (var j = 0; j < names.length; j++) {
                    if (this.roles[i] == names[j])
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