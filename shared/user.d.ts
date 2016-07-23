declare namespace Grafika {    
    interface IUser {
        _id: string | any;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        dateCreated: number;
        dateModified: number;
        active: boolean;
        roles: string[];
    }

    interface IUserPreference {
        
    }
}