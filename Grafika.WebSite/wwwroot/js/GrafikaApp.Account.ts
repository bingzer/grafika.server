module GrafikaApp {
    export class Account {

        /**
         * Upload avatar image
         * @param blob
         */
        public static uploadAvatar(blob: Blob) {
            let apiUserAvatarUrl = GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, '/api/users/', GrafikaApp.User._id, 'avatar');
            var options = { url: apiUserAvatarUrl, data: { imageType: 'avatar', mime: blob.type }, method: 'post' };
            GrafikaApp.sendAjax(options, (err, result, elem) => {
                return GrafikaApp.Account.uploadToAws(result as Grafika.ISignedUrl, blob)
                    .then(() => GrafikaApp.toast('Successfully uploaded'));
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