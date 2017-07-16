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
            let animUrl = `${GrafikaApp.Configuration.baseApiUrl}/animations/${animationId}`;
            let qAnim = jQuery.ajax({ url: `${animUrl}` });
            let qFrames = jQuery.ajax({ url: `${animUrl}/frames` });
            return jQuery.when(qAnim, qFrames).done((resAnim, resFrames) => {
                this.grafika.setAnimation(resAnim[0]);
                this.grafika.setFrames(resFrames[0]);
                return jQuery.when(0);
            });
        }

        destroy() {
            this.grafika.destroy();
        }
    }
}
