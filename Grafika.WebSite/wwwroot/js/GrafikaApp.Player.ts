module GrafikaApp {
    export class Player {
        public grafika: Grafika.IGrafika = new Grafika();

        constructor(canvasElementId: string) {
            this.grafika.initialize(canvasElementId, { debugMode: true, useCarbonCopy: false, useNavigationText: false, loop: true });
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
            return jQuery.when({ isPlaying: this.grafika.isPlaying() });
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
                this.grafika.setAnimation(resAnim[0]);
                this.grafika.setFrames(resFrames[0]);
                return jQuery.when(0);
            });
        }

        destroy() {
            this.grafika.destroy();
        }

        private getConfiguration(): GrafikaApp.IGrafikaAppConfig {
            if (GrafikaApp && GrafikaApp.Configuration)
                return GrafikaApp.Configuration;
            return new GrafikaApp.DefaultConfiguration();
        }
    }

    export class DefaultConfiguration implements GrafikaApp.IGrafikaAppConfig {
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
