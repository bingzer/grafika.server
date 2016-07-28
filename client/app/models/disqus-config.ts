module GrafikaApp {
    export class DisqusConfig {
        public disqus_identifier: string;
        public disqus_url: string;
        public disqus_api_key: string;
        public disqus_shortname: string;
        public disqus_title: string;
        public disqus_category_id: string;
        public disqus_remote_auth_s3: string;

        constructor(appCommon: AppCommon, uniqueId: string) {
            this.disqus_identifier = uniqueId;
            this.disqus_url = 'http://grafika.herokuapp.com/' + appCommon.$location.url();
            this.disqus_api_key = 'reBkv3Z517WqqbOMhaPOWx710h0JqXRf9X71HMsDTkEfmdvoRYGfxZSJXlQrgzgj';
            this.disqus_shortname = 'grafika-app';
            this.disqus_title = 'grafika';
            //this.disqus_category_id = '';
        }
    }
}