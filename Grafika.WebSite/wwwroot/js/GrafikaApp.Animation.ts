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
                    GrafikaApp.toast(`You have an unsaved animation<br/><strong>${anim.name}</strong>. <br/>
                                     What would you like to do?<br/><br/>
                                     <button class="btn clear btn-sm btn-default" onclick="GrafikaApp.Animation.publishUnsavedAnimation()">Publish</button>
                                     <button class="btn clear btn-sm btn-default" onclick="GrafikaApp.Animation.editUnsavedAnimation()">Edit</button>
                                     <button class="btn btn-sm btn-danger" onclick="GrafikaApp.Animation.discardUnsavedAnimation()">Discard</button>
                                     `, undefined, options);
                });

                return defer.promise();
            })
            .then((anim) => {
                return jQuery.when(anim);
            });

            return defer.promise();
        }

        public static publishUnsavedAnimation(): void {
            GrafikaApp.Animation.publishAnimation()
                .then((anim) => GrafikaApp.Animation.publishFrames(anim))
                .then((anim) => GrafikaApp.Animation.publishThumbnail(anim))
                .then((anim) => {
                    GrafikaApp.Animation.discardUnsavedAnimation();
                    GrafikaApp.toast('Successfully published');
                    GrafikaApp.navigateHome();
                });
        }

        public static editUnsavedAnimation(): void {
            GrafikaApp.navigateTo('/try-it?load=true');
        }

        public static discardUnsavedAnimation(): void {
            GrafikaApp.removeStorageItem(GrafikaApp.StorageAnimationKey);
            GrafikaApp.removeStorageItem(GrafikaApp.StorageFramesKey);
        }

        private static publishAnimation(): JQueryPromise<Grafika.IAnimation> {
            return GrafikaApp.defer<Grafika.IAnimation>((defer) => {
                GrafikaApp.getStorageItem(GrafikaApp.StorageAnimationKey).then((anim: Grafika.IAnimation) => {
                    GrafikaApp.sendAjax({
                        url: GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, "animations"),
                        method: 'post',
                        data: anim,
                        callback: ($result: Grafika.IAnimation) => defer.resolve($result),
                        errorCallback: () => defer.reject()
                    });
                });
            }).promise();
        }

        private static publishFrames(anim: Grafika.IAnimation): JQueryPromise<Grafika.IAnimation> {
            return GrafikaApp.defer((defer) => {
                GrafikaApp.getStorageItem(GrafikaApp.StorageFramesKey).then((frames) => {
                    let framesUrl = GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, "animations", anim._id, "frames");
                    GrafikaApp.sendAjax({
                        url: framesUrl,
                        method: 'post',
                        data: frames,
                        callback: () => defer.resolve(anim),
                        errorCallback: () => defer.reject()
                    })
                });
            }).promise();
        }

        private static publishThumbnail(anim: Grafika.IAnimation): JQueryPromise<Grafika.IAnimation> {
            return GrafikaApp.defer((defer) => {
                let signedUrl: Grafika.ISignedUrl;
                GrafikaApp.sendAjax({
                    url: GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, "animations", anim._id, "thumbnail"),
                    method: 'post'
                }).then((res) => {
                    signedUrl = res;
                    return GrafikaApp.getStorageItem(GrafikaApp.StorageThumbnailKey);
                }).then((base64: string) => {
                    return GrafikaApp.sendAjax({
                        url: signedUrl.signedUrl,
                        method: 'put',
                        beforeSend: (jqXHR: JQueryXHR, settings: JQueryAjaxSettings): any => {
                            delete settings.headers["Authorization"];
                        },
                        headers: {
                            'Content-Type': signedUrl.mime,
                            'Content-Encoding': 'base64',
                            'X-amz-acl': 'public-read'
                        },
                        processData: false,
                        data: GrafikaApp.Animation.getBlob(base64, signedUrl.mime),
                        callback: () => defer.resolve(anim),
                        errorCallback: () => defer.reject()
                    } as JQueryAjaxSettings);
                });
            }).promise();
        }

        private static getBlob = (base64: string, contentType: string = '', sliceSize = 512) => {
            const byteCharacters = atob(base64);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }


    }
}