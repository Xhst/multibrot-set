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

    public redraw(): void {
        this.application.draw();
    }

    public moveCanvas(canvasType: CanvasType, offsetXChange: number, offsetYChange: number): void {
        const move = (canvas: Canvas) => {
            canvas.offsetY += offsetYChange;
            canvas.offsetX += offsetXChange;
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

    public zoomCanvas(canvasType: CanvasType, scaleChange: number): void {
        const zoom = (canvas: Canvas) => {
            canvas.scale += scaleChange;
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