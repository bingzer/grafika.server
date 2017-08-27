module GrafikaApp {
    export module Drawing {
        export module Services {

            export class AnimationService {
                public static $inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
                constructor(
                    private appCommon: AppCommon,
                    private authService: AuthService,
                    private apiService: ApiService,
                    private resourceService: ResourceService
                ) {
                    // nothing
                }

                create(anim: Grafika.IAnimation): ng.IHttpPromise<Grafika.IAnimation> {
                    return this.apiService.post('animations', anim);
                }
                get(_id: string): ng.IHttpPromise<Grafika.IAnimation> {
                    return this.apiService.get<Grafika.IAnimation>('animations/' + _id)
                        .then((res) => <ng.IHttpPromise<Grafika.IAnimation>> this.injectResources(res));
                }
                update(anim: Grafika.IAnimation): ng.IHttpPromise<any> {
                    return this.apiService.put('animations/' + anim._id, anim);
                }
                getDownloadLink(anim: Grafika.IAnimation): string {
                    return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
                }

                injectResources(res: ng.IHttpPromiseCallbackArg<Grafika.IAnimation | Grafika.IAnimation[]>): ng.IHttpPromise<Grafika.IAnimation | Grafika.IAnimation[]> {
                    if (angular.isArray(res.data)) {
                        let anims = <[Grafika.IAnimation]>res.data;
                        anims.forEach(anim => this.fixedResourceUrls(anim));
                    }
                    else {
                        this.fixedResourceUrls(res.data);
                    }
                    return this.appCommon.$q.when(res);
                }

                private fixedResourceUrls(anim: Grafika.IAnimation) {
                    if (anim.resources) {
                        anim.resources.forEach(res => {
                            let resource: any = res;
                            if (resource.type == 'background-image' && (!resource.base64)) {
                                resource.url = GrafikaApp.combineUrl(this.appCommon.appConfig.baseApiUrl, 'animations', anim._id, 'resources', resource.id);
                            }
                        });
                    }
                    anim.thumbnailUrl = this.resourceService.getThumbnailUrl(anim);
                }
            }

        }
    }
}