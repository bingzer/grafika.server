module GrafikaApp {
    export module Drawing {
        export module Services {
            export class ResourceService extends BaseService {
                public static $inject = ['appCommon', 'authService', 'apiService'];
                constructor(
                    appCommon: AppCommon,
                    private authService: AuthService,
                    private apiService: ApiService) {
                    super(appCommon);
                }

                list(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
                    return this.apiService.get('animations/' + anim._id + '/resources/');
                }
                get(anim: Grafika.IAnimation, resourceId: string): ng.IHttpPromise<Grafika.IResource> {
                    return this.apiService.get('animations/' + anim._id + '/resources/' + resourceId);
                }
                del(anim: Grafika.IAnimation, resourceId: string): ng.IHttpPromise<any> {
                    return this.apiService.delete('animations/' + anim._id + '/resources/' + resourceId);
                }
                create(anim: Grafika.IAnimation, resource: Grafika.IResource): ng.IHttpPromise<any> {
                    return this.apiService.post('animations/' + anim._id + '/resources/', resource);
                }
                upload(data: Grafika.ISignedUrl, blob: Grafika.ICanvasBlob): ng.IHttpPromise<any> {
                    if (!data.mime || !data.signedUrl)
                        throw new Error('Expecting data.mime && data.signedUrl');
                    let req = {
                        method: 'PUT',
                        url: data.signedUrl,
                        cors: true,
                        headers: {
                            'Authorization': undefined,
                            'Content-Type': data.mime,  // must match with nodejs getSignUrl
                            'x-amz-acl': 'public-read',
                        },
                        data: blob.blob
                    };
                    return this.apiService.$http(req);
                }
                getResourceUrl(entity: Grafika.IAnimation | Grafika.IBackground, resource: Grafika.IResource | string): string {
                    let resourceId = resource;
                    if (resource && (<Grafika.IResource>resource).id)
                        resourceId = (<Grafika.IResource>resource).id;

                    return GrafikaApp.combineUrl(this.appCommon.appConfig.baseApiUrl, this.resourcePath(entity), entity._id, 'resources', resourceId);
                }
                saveResource(entity: Grafika.IAnimation | Grafika.IBackground, resource: Grafika.IResource): ng.IHttpPromise<Grafika.ISignedUrl> {
                    return this.apiService.post(this.resourcePath(entity) + entity._id + '/resources', resource);
                }
                getThumbnailUrl(entity: Grafika.IAnimation | Grafika.IBackground): string {
                    return this.appCommon.appConfig.baseApiUrl + this.resourcePath(entity) + entity._id + '/thumbnail';
                }
                saveThumbnail(entity: Grafika.IAnimation | Grafika.IBackground): ng.IHttpPromise<Grafika.ISignedUrl> {
                    return this.apiService.post(this.resourcePath(entity) + entity._id + '/thumbnail');
                }

                private resourcePath(entity: Grafika.IAnimation | Grafika.IBackground): string {
                    let path = "animations/";
                    if (entity.type.toLowerCase() == "background")
                        path = "backgrounds/";
                    return path;
                }

            }
        }
    }
}