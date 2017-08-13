module GrafikaApp {
    export class ResourceListController extends DialogController {
        public static $inject = ['appCommon', 'resourceService', 'resources', 'grafika'];
        constructor(
            appCommon: AppCommon, 
            private resourceService: ResourceService,
            private resources: Grafika.IResource[],
            private grafika: Grafika.IGrafika
        ){
            super(appCommon);
            this.list();
        }

        list() {
            if (!this.resources || this.resources.length <= 0) {
                this.appCommon.toastError('No resources available');
                this.close();
            }
        }

        select(resourceId: string) {
            let resource = this.resources.filter(r => r.id == resourceId)[0];
            this.close(resource);
        }

        deleteResource(resourceId) {
            this.resourceService.del(this.grafika.getAnimation(), resourceId).then(() => {
                this.grafika.deleteResource(resourceId);
                this.resources = this.grafika.getResources();
                this.list();
            });
        }
    }
}