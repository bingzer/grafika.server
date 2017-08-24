module GrafikaApp {
    export class Account {

        public static toggleExternalLogin(id: string, name: string) {
            let url = GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, '/accounts/', name);
            if (id) {
                let options = {
                    url: url,
                    method: 'delete',
                    callback: GrafikaApp.refreshPage
                };
                GrafikaApp.sendAjax(options);
            }
            else {
                GrafikaApp.navigateTo(url);
            }
        }

        /**
         * Upload backdrop image
         * @param blob
         */
        public static uploadBackdrop(blob: Blob) {
            GrafikaApp.Account.uploadResource("backdrop", blob);
        }

        /**
         * Upload avatar image
         * @param blob
         */
        public static uploadAvatar(blob: Blob) {
            GrafikaApp.Account.uploadResource("avatar", blob);
        }

        private static uploadResource(imageType: "avatar" | "backdrop", blob: Blob) {
            let apiUserAvatarUrl = GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, '/users/', GrafikaApp.User._id, imageType);
            var options = { url: apiUserAvatarUrl, data: { imageType: imageType, mime: blob.type }, method: 'post' };
            GrafikaApp.sendAjax(options, (err, result, elem) => {
                return GrafikaApp.Account.uploadToAws(result as Grafika.ISignedUrl, blob)
                    .then(() => GrafikaApp.toast(`Done. ${imageType} is successfully uploaded`));
            });
        }

        private static uploadToAws(signedUrl: Grafika.ISignedUrl, blob: Blob): JQueryPromise<any> {
            let options: JQueryAjaxSettings = {
                url: signedUrl.signedUrl,
                method: 'PUT',
                processData: false,
                contentType: signedUrl.mime,
                beforeSend: (jqXHR: JQueryXHR, settings: JQueryAjaxSettings): any => {
                    delete settings.headers["Authorization"];
                },
                headers: {
                    'Content-Type': signedUrl.mime,
                    'X-amz-acl': 'public-read'
                },
                data: blob
            };
            return GrafikaApp.sendAjax(options);
        }
    }
}