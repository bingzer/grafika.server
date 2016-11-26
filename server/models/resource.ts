

export class Resource implements Grafika.IResource {
    id: any | string;
    type: string;

    constructor(resource?: Resource | any) {
        if (resource) {
            this.id = resource._id;
            this.type = resource.type;
        }
    }
}

export class Thumbnail extends Resource {
    mime: string = "image/png";
    animationId: string;

    constructor(animationId: string) {
        super();
        this.id = "thumbnail";
        this.type = "thumbnail";
        this.mime = "image/png";
        this.animationId = animationId;
    }
}