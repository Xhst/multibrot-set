import { Application } from './application';
import { Settings } from './settings';
import { Canvas } from './canvas';

export enum CanvasType {
    GLOBAL = '',
    MULTIBROT = 'm',
    JULIA = 'j'
}

export class Input {
    public application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    /**
     * Redraws the fractals on the canvas.
     */
    public redraw(): void {
        this.application.draw();
    }

    /**
     * Moves the canvas by the specified offset.
     * 
     * @param canvasType the type of canvas to move
     * @param offsetXChange x-axis offset change
     * @param offsetYChange y-axis offset change
     */
    public moveCanvas(canvasType: CanvasType, offsetXChange: number, offsetYChange: number): void {
        const move = (canvas: Canvas) => {
            canvas.offsetY += offsetYChange * canvas.scale;
            canvas.offsetX += offsetXChange * canvas.scale;
        };

        switch (canvasType) {
            case CanvasType.MULTIBROT:
                move(this.application.multibrotCanvas);
            break;
            case CanvasType.JULIA:
                move(this.application.juliaCanvas);
            break;
            case CanvasType.GLOBAL:
                move(this.application.multibrotCanvas);
                move(this.application.juliaCanvas);
            break;
        }
        this.redraw();
    }

    /**
     * Zooms the canvas by the specified scale change.
     * The zoom is based on the current scale of the canvas with a logarithmic scale.
     * 
     * @param canvasType the type of canvas to zoom
     * @param scaleChange scale change
     */
    public zoomCanvas(canvasType: CanvasType, scaleChange: number): void {
        const zoom = (canvas: Canvas) => {
            canvas.scale -= Math.log1p(canvas.scale) * scaleChange;
        };

        switch (canvasType) {
            case CanvasType.MULTIBROT:
                zoom(this.application.multibrotCanvas);
            break;
            case CanvasType.JULIA:
                zoom(this.application.juliaCanvas);
            break;
            case CanvasType.GLOBAL:
                zoom(this.application.multibrotCanvas);
                zoom(this.application.juliaCanvas);
            break;
        }
        this.redraw();
    }

    /**
     * Downloads the image of the canvas.
     * 
     * @param canvasType the type of canvas to download
     */
    public downloadImage(canvasType: CanvasType): void {
        const download = (canvas: Canvas, filename: string) => {
            canvas.saveAsImage(`${filename}.png`);
        }
        
        switch (canvasType) {
            case CanvasType.MULTIBROT:
                download(this.application.multibrotCanvas, 'multibrot');
            break;
            case CanvasType.JULIA:
                download(this.application.juliaCanvas, 'julia');
            break;
            case CanvasType.GLOBAL:
                download(this.application.multibrotCanvas, 'multibrot');
                download(this.application.juliaCanvas, 'julia');
            break;
        }
    }

    /**
     * Updates the Julia seed based on a point in the multibrot canvas.
     * 
     * @param x the x-coordinate of the multibrot
     * @param y the y-coordinate of the multibrot
     */
    public updateJuliaSeed(x: number, y: number): void {
        const rect: DOMRect = this.application.multibrotCanvas.canvasElement.getBoundingClientRect();
        const width = this.application.multibrotCanvas.width
        const height = this.application.multibrotCanvas.height
        const offsetX: number = this.application.multibrotCanvas.offsetX;
        const offsetY: number = this.application.multibrotCanvas.offsetY;
        const scale: number = this.application.multibrotCanvas.scale;

        const clientX: number = x - rect.left;
        const clientY: number = y - rect.top;
        
        const fragX = clientX
        const fragY = height - clientY
    
        const newX = ((fragX - (width / 2)) * (scale / width)) + offsetX;
        const newY = ((fragY - (height / 2)) * (scale / width)) + offsetY;
        
        Settings.updateJuliaSeed({x: newX, y: newY})
            
        this.redraw();
    }

}