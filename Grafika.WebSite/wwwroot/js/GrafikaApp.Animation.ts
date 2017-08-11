module GrafikaApp {
    export class Animation {

        public static checkLocalAnimation(): JQueryPromise<Grafika.IAnimation> {
            let defer = jQuery.Deferred<Grafika.IAnimation>((defer) => {
                if (GrafikaApp.hasStorageItem(GrafikaApp.StorageAnimationKey))
                    return GrafikaApp.getStorageItem<Grafika.IAnimation>(GrafikaApp.StorageAnimationKey).then((anim) => defer.resolve(anim));
                return defer.reject();
            })
            .then((anim) => {
                let defer = GrafikaApp.defer<Grafika.IAnimation>((defer) => {
                    let options = {
                        closeButton: true,
                        timeOut: 0,
                        extendedTimeOut: 0,
                        positionClass: "toast-top-right"
                    } as ToastrOptions;
                    GrafikaApp.toast(`<strong>${anim.name}</strong>. <br/>What would you like to do?<br/><br/>
                                     <button class="btn clear btn-sm" onclick="GrafikaApp.Animation.publishLocal()">Publish</button>
                                     <button class="btn clear btn-sm" onclick="GrafikaApp.Animation.editLocal()">Edit</button>
                                     <button class="btn btn-sm btn-danger" onclick="GrafikaApp.Animation.publishLocal()">Discard</button>
                                     `, "Unsaved Animation", options);
                });

                return defer.promise();
            })
            .then((anim) => {
                return jQuery.when(anim);
            });

            return defer.promise();
        }

    }
}