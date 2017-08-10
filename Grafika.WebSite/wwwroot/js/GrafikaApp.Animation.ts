module GrafikaApp {
    export class Animation {

        public static checkLocalAnimation(): JQueryPromise<Grafika.IAnimation> {
            let editDeferred: JQueryDeferred<Grafika.IAnimation> = GrafikaApp.defer((deferred) => {
                GrafikaApp.navigateTo('/try-it');
                deferred.resolve();
            });
            let uploadDeferred: JQueryDeferred<Grafika.IAnimation> = GrafikaApp.defer((deferred) => {
                deferred.resolve();
            });
            let discardDeferred: JQueryDeferred<Grafika.IAnimation> = GrafikaApp.defer((deferred) => {
                GrafikaApp.removeStorageItem(GrafikaApp.StorageAnimationKey);
                GrafikaApp.removeStorageItem(GrafikaApp.StorageFramesKey);
                deferred.resolve();
            });

            let defer = jQuery.Deferred<Grafika.IAnimation>((defer) => {
                if (GrafikaApp.hasStorageItem(GrafikaApp.StorageAnimationKey))
                    return GrafikaApp.getStorageItem<Grafika.IAnimation>(GrafikaApp.StorageAnimationKey).then((anim) => defer.resolve(anim));
                return defer.reject();
            })
            .then((anim) => {
                let defer = GrafikaApp.defer<Grafika.IAnimation>((defer) => {
                    bootbox.dialog({
                        title: 'Unsaved Animation',
                        message: `You have an unsaved animation. <br/> <strong> ${anim.name}</strong><br/> What would you like to do?`,
                        buttons: {
                            edit: {
                                label: "Edit",
                                className: "btn btn-success",
                                callback: () => editDeferred.promise().then(() => defer.resolve(anim))
                            } as BootboxButton,
                            upload: {
                                label: "Upload",
                                className: "btn btn-default",
                                callback: () => uploadDeferred.promise().then(() => defer.resolve(anim))
                            } as BootboxButton,
                            discard: {
                                label: "Discard Changes",
                                className: "btn btn-danger",
                                callback: () => discardDeferred.promise().then(() => defer.reject())
                            } as BootboxButton
                        } as BootboxButtonMap
                    });
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