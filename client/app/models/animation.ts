module GrafikaApp {
    export class Animation implements Grafika.IAnimation {
        _id: string;

        name: string;
        description: string;

        timer: number;
        width: number;
        height: number;

        dateCreated: Date;
        dateModified: Date;

        views: number;
        rating: number;
        category: string;

        isPublic: boolean;
        author: string;
        userId: string;

        frames: [Grafika.IFrame];
    }
}