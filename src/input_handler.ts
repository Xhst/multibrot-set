import { Application } from './application';

export class InputHandler {
    private readonly SCALE_STEP: number = 0.05;
    private interval: NodeJS.Timeout | null = null;

    constructor(application: Application) {
        this.addEventListeners(application);
    }

    private addEventListeners(application: Application) {
    
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
    
        // Event listener for changing maximum iterations
        document.getElementById('redraw-btn')!.addEventListener('click', () => {
            application.draw();
        });
    
        document.getElementById('side-by-side')!.addEventListener('change', () => {
            const sideBySide: boolean = (document.getElementById('side-by-side') as HTMLInputElement).checked
            let width = sideBySide ? window.innerWidth/2 : window.innerWidth;
            let height = window.innerHeight;
            
            application.mandelbrotCanvas.width = width;
            application.mandelbrotCanvas.height = height;

            application.juliaCanvas.width = width;
            application.juliaCanvas.height = height;
    
            application.draw();
        });
        document.getElementById('color-alg')!.addEventListener('change', () => {        
            application.draw();
        });
    
    
    
        application.mandelbrotCanvas.canvasElement.addEventListener('click', (event: MouseEvent) => {
            updateJuliaPosition(event);
        });
        application.mandelbrotCanvas.canvasElement.addEventListener('touchstart', (event: TouchEvent) => {
            updateJuliaPosition(event);
        });
    
        // Get the pointer coordinates on the canvas
        const updateJuliaPosition = (event: MouseEvent | TouchEvent) => {
            const rect: DOMRect = application.mandelbrotCanvas.canvasElement.getBoundingClientRect();
            const width = application.mandelbrotCanvas.width
            const height = application.mandelbrotCanvas.height
            const offsetX: number = application.mandelbrotCanvas.offsetX;
            const offsetY: number = application.mandelbrotCanvas.offsetY;
            const scale: number = application.mandelbrotCanvas.scale;

            const clientX: number = ((event instanceof MouseEvent) ? event.clientX : (event.touches[0].clientX)) - rect.left;
            const clientY: number = ((event instanceof MouseEvent) ? event.clientY : (event.touches[0].clientY)) - rect.top;
            
            const fragX = clientX
            const fragY = height - clientY
    
            const x = ((fragX - (width / 2)) * (scale/ width)) + offsetX;
            const y = ((fragY - (height / 2)) * (scale / width)) + offsetY;
            
            (document.getElementById('julia-x') as HTMLInputElement).value = x.toString();
            (document.getElementById('julia-y') as HTMLInputElement).value = y.toString();
            
            application.draw();
        };
    
        // Event listeners for movements and zooming (touch) - Mandelbrot
        document.getElementById('m-move-up')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-down')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-right')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-left')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-zoom-out')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-zoom-in')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for movements and zooming (mouse) - Mandelbrot
        document.getElementById('m-move-up')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-down')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-right')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-move-left')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-zoom-out')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('m-zoom-in')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for discrete movements and zooming - Mandelbrot
        document.getElementById('m-move-up')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('m-move-down')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('m-move-right')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('m-move-left')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('m-zoom-out')!.addEventListener('click', () => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('m-zoom-in')!.addEventListener('click', () => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.draw();
        });

        // Event listeners for movements and zooming (touch) - Julia
        document.getElementById('j-move-up')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-down')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-right')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-left')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-zoom-out')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-zoom-in')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for movements and zooming (mouse) - Julia
        document.getElementById('j-move-up')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-down')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-right')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-move-left')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-zoom-out')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('j-zoom-in')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for discrete movements and zooming - Julia
        document.getElementById('j-move-up')!.addEventListener('click', () => {
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('j-move-down')!.addEventListener('click', () => {
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('j-move-right')!.addEventListener('click', () => {
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('j-move-left')!.addEventListener('click', () => {
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('j-zoom-out')!.addEventListener('click', () => {
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('j-zoom-in')!.addEventListener('click', () => {
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
        });

        // Event listeners for movements and zooming (touch) - Both
        document.getElementById('move-up')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-down')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-right')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-left')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('zoom-out')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('zoom-in')!.addEventListener('touchstart', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for movements and zooming (mouse) - Both
        document.getElementById('move-up')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-down')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-right')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('move-left')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('zoom-out')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        document.getElementById('zoom-in')!.addEventListener('mousedown', () => {
            this.interval = setInterval(() => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
            }, 100);
        });

        // Event listeners for discrete movements and zooming - Both
        document.getElementById('move-up')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetY -= this.SCALE_STEP;
            application.juliaCanvas.offsetY -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('move-down')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetY += this.SCALE_STEP;
            application.juliaCanvas.offsetY += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('move-right')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetX -= this.SCALE_STEP;
            application.juliaCanvas.offsetX -= this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('move-left')!.addEventListener('click', () => {
            application.mandelbrotCanvas.offsetX += this.SCALE_STEP;
            application.juliaCanvas.offsetX += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('zoom-out')!.addEventListener('click', () => {
            application.mandelbrotCanvas.scale += this.SCALE_STEP;
            application.juliaCanvas.scale += this.SCALE_STEP;
            application.draw();
        });

        document.getElementById('zoom-in')!.addEventListener('click', () => {
            application.mandelbrotCanvas.scale -= this.SCALE_STEP;
            application.juliaCanvas.scale -= this.SCALE_STEP;
            application.draw();
        });

    }
}