declare namespace Grafika {    
    interface IUser {
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        dateCreated: Date;
        dateModified: Date;
        active: boolean;
        roles: string[];
    }
}