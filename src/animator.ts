import GIF from 'gif.js';
import { Application } from './application';
import { Settings } from './settings';

export class Animator {

    static base_fn = (x: number) => { return { 
        x: 0.28 - (0.26 * (1 - 2 * Math.cos(x) + Math.cos(2 * x))), 
        y: 0.26 * (2 * Math.sin(x) - Math.sin(2 * x)) 
    }};

    private generateCurvePoints(
        minX: number = 0, 
        maxX: number = (2 * Math.PI), 
        step: number = 0.1,
        fn: (x: number) => {x: number, y: number} = Animator.base_fn
    ): {x: number, y: number}[] {
        let points: {x: number, y: number}[] = [];

        for (let x = minX; x < maxX; x += step) {
            points.push(fn(x));
        }

        return points;
    }

    public generateGif(application: Application): void {
        let juliaCanvas = application.juliaCanvas;
        let ctx = juliaCanvas.canvasElement.getContext('webgl');
        
        let gif = new GIF({
            workers: 2,
            quality: 10,
            width: juliaCanvas.width,
            height: juliaCanvas.height,
            workerScript: '/assets/js/gif.worker.js'
        });

        let points = this.generateCurvePoints();
        
        for (let point of points) {
            Settings.updateJuliaSeed(point);
            application.draw();
            let pixels = new Uint8Array(juliaCanvas.width * juliaCanvas.height * 4);
            ctx.readPixels(0, 0, juliaCanvas.width, juliaCanvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
            let imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), juliaCanvas.width, juliaCanvas.height);
            gif.addFrame(imageData);
        }

        gif.on('finished', function(blob) {
            window.open(URL.createObjectURL(blob));
        });
          
        gif.render();
    }
}