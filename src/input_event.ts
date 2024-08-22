import { Input, CanvasType } from './input';
import { Settings } from './settings';

export class InputEvent {
    private readonly MOVEMENT_STEP: number = 0.05;
    private readonly INTERVAL_MS: number = 100;
    private interval: NodeJS.Timeout | null = null;

    private input: Input;

    constructor(input: Input) {
        this.input = input;

        this.registerEvents();
    }

    private registerEvents(): void {
        // Add event listener to clear this.interval on mouseup
        document.addEventListener('mouseup', () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
        });
    
        // Add event listener to clear this.interval on touchend
        document.addEventListener('touchend', () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
        });

        this.registerMovementEvents();
        this.registerDownloadEvents();
        this.registerJuliaSeedEvents();
        this.registerButtonEvents();
    }

    private registerMovementEvents(): void {
        for (const canvasType of Object.values(CanvasType)) {
            const prefix = canvasType === CanvasType.GLOBAL ? '' : `${canvasType}-`;

            const movementActions: Record<string, () => void> = {
                'move-up': () => this.input.moveCanvas(canvasType, 0, this.MOVEMENT_STEP),
                'move-down': () => this.input.moveCanvas(canvasType, 0, -this.MOVEMENT_STEP),
                'move-right': () => this.input.moveCanvas(canvasType, this.MOVEMENT_STEP, 0),
                'move-left': () => this.input.moveCanvas(canvasType, -this.MOVEMENT_STEP, 0),
                'zoom-in': () => this.input.zoomCanvas(canvasType, this.MOVEMENT_STEP),
                'zoom-out': () => this.input.zoomCanvas(canvasType, -this.MOVEMENT_STEP)
            };

            for (const action in movementActions) {
                const element = document.getElementById(`${prefix}${action}`);

                if (!element) continue;

                element.addEventListener('click', () => movementActions[action]());

                element.addEventListener('mousedown', () => {
                    movementActions[action]();
                    this.interval = setInterval(() => movementActions[action](), this.INTERVAL_MS);
                });

                element.addEventListener('touchstart', () => {
                    movementActions[action]();
                    this.interval = setInterval(() => movementActions[action](), this.INTERVAL_MS);
                });                
            }
        }
    }

    private registerDownloadEvents(): void {
        for (const canvasType of Object.values(CanvasType)) {
            const prefix = canvasType === CanvasType.GLOBAL ? '' : `${canvasType}-`;

            const element = document.getElementById(`${prefix}download`);

            if (!element) continue;

            element.addEventListener('click', () => this.input.downloadImage(canvasType));
        }
    }

    private registerJuliaSeedEvents(): void {
        const element = this.input.application.multibrotCanvas.canvasElement;
        element.addEventListener('click', (event: MouseEvent) => {
            this.input.updateJuliaSeed(event.clientX, event.clientY);
        });
        element.addEventListener('touchstart', (event: TouchEvent) => {
            this.input.updateJuliaSeed(event.touches[0].clientX, event.touches[0].clientY);
        });
    }

    private registerButtonEvents(): void {
        document.getElementById('redraw-btn')!.addEventListener('click', () => {
            this.input.redraw();
        });
    
        document.getElementById('side-by-side')!.addEventListener('change', () => {
            Settings.toggleSideBySide();
        });

        document.getElementById('color-alg')!.addEventListener('change', () => {        
            this.input.redraw();
        });
    }

}