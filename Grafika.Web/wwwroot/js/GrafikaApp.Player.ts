module GrafikaApp {
    export class Player {
        private hasBeenPlayed: boolean = false;
        public grafika: Grafika.IGrafika = new Grafika();

        constructor(canvasElementId: string) {
            this.grafika.initialize(canvasElementId, { debugMode: this.getConfiguration().debug, useCarbonCopy: false, useNavigationText: false, loop: true });
        }

        togglePlay(): Q.IPromise<{ isPlaying: boolean }> {
            if (this.grafika.isPlaying()) {
                return this.pause();
            }
            else {
                return this.play();
            }
        };

        play(): Q.IPromise<{ isPlaying: boolean }> {
            this.grafika.play();
            if (!this.hasBeenPlayed) {
                GrafikaApp.sendAjax({ url: GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, "animations", this.grafika.getAnimation()._id, "view"), method: 'post' });
                this.hasBeenPlayed = true;
            }
            return jQuery.when({ isPlaying: this.grafika.isPlaying() });
        }

        previousFrame() {
            this.grafika.previousFrame();
        }

        nextFrame() {
            if (this.grafika.frame.index < this.grafika.animation.totalFrame - 1) {
                this.grafika.nextFrame();
            }
        }

        pause(): Q.IPromise<{ isPlaying: boolean }> {
            this.grafika.pause();
            return jQuery.when({ isPlaying: this.grafika.isPlaying() });
        }

        loadAnimation(animationId: string): Q.IPromise<any> {
            let config = this.getConfiguration();
            let shouldInflateFrames = (config.shouldInflateFrame) ? "?X-inflate-frames=true" : "";
            let animUrl = `${config.baseApiUrl}/animations/${animationId}`;
            let qAnim = jQuery.ajax({ url: `${animUrl}` });
            let qFrames = jQuery.ajax({ url: `${animUrl}/frames${shouldInflateFrames}` });
            return jQuery.when(qAnim, qFrames).done((resAnim, resFrames) => {
                let anim = resAnim[0] as Grafika.IAnimation;
                if (anim.resources) {
                    // -- inject background-image type
                    anim.resources.forEach(res => {
                        if (res.type == 'background-image') {
                            (res as Grafika.IBackgroundImageResource).url = GrafikaApp.combineUrl(GrafikaApp.Configuration.baseApiUrl, "animations", anim._id, "resources", res.id);
                        }
                    });
                }

                this.grafika.setAnimation(anim);
                this.grafika.setFrames(resFrames[0]);
                return jQuery.when(0);
            });
        }

        destroy() {
            this.grafika.destroy();
        }

        private getConfiguration(): GrafikaApp.IGrafikaAppConfiguration {
            if (GrafikaApp && GrafikaApp.Configuration)
                return GrafikaApp.Configuration;
            return new GrafikaApp.DefaultConfiguration();
        }
    }

    export class DefaultConfiguration implements GrafikaApp.IGrafikaAppConfiguration {
        debug: boolean = true;
        baseApiUrl: string = "http://localhost:3000";
        shouldInflateFrame: boolean = true;
        getAuthenticationToken(): string {
            throw new Error('Method not implemented.');
        }
        setAuthenticationToken(token: string): void {
            throw new Error('Method not implemented.');
        }
    }
}
