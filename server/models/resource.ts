

export class Resource implements Grafika.IResource {
    _id: any | string;
    animationId: string;
    mime: string;

    constructor(resource?: Resource | any) {
        if (resource) {
            this._id = resource._id;
            this.animationId = resource.animationId;
            this.mime = resource.mime;
        }
    }
}