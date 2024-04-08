import juliaVariables from './shaders/variables/julia.glsl';
import multibrotVariables from './shaders/variables/multibrot.glsl';
import juliaUniforms from './shaders/uniforms/julia.glsl';
import multibrotIterations from './shaders/iterations/multibrot.glsl';
import grayscaleColoring from './shaders/coloring/grayscale.glsl';
import discreteColoring from './shaders/coloring/discrete.glsl';
import linearColoring from './shaders/coloring/linear.glsl';
import normalizedIterationCountColoring from './shaders/coloring/normalized_iteration_count.glsl';
import { Canvas } from "./canvas";
import { Shader } from "./shader";
import { basePalette } from "./colors";
import { InputHandler } from "./input_handler";

/**
 * Represents the main application controlling Multibrot and Julia sets visualization.
 */
export class Application {

    private readonly canvasContainer: HTMLElement;

    private readonly multibrot: Canvas;
    private readonly julia: Canvas;

    private multibrotShader: Shader;
    private juliaShader: Shader;

    constructor() {
        // Initialize canvas container
        this.canvasContainer = document.getElementById("canvas-container");

        // Calculate canvas width and height
        let sideBySide: boolean = (document.getElementById('side-by-side') as HTMLInputElement).checked
        let width = sideBySide ? window.innerWidth / 2 : window.innerWidth;
        let height = window.innerHeight;

        // Initialize Multibrot and Julia canvases
        this.multibrot = new Canvas(this.canvasContainer, width, height);
        this.julia = new Canvas(this.canvasContainer, width, height);

        // Initialize shaders
        this.multibrotShader = new Shader();
        this.juliaShader = new Shader();
    }

    /**
     * Starts the application.
     */
    public start(): void {
        this.multibrot.init();
        this.julia.init();
        
        new InputHandler(this);

        this.draw();
    }

    /**
     * Draws the Mandelbrot and Julia sets.
     */
    public draw(): void {
        this.setupShaders();

        this.multibrot.draw(this.multibrotShader);
        this.julia.draw(this.juliaShader, this.getJuliaSeed());
    }

    /**
     * Sets up shaders for Mandelbrot and Julia sets.
     */
    private setupShaders(): void {
        this.multibrotShader.updateMaxIterations(this.getMaxIterations());
        this.multibrotShader.updateBailOut(this.getBailOut());
        this.multibrotShader.updateVariables(multibrotVariables);
        this.multibrotShader.updateIterationsAlgorithm(multibrotIterations);
        this.multibrotShader.updateColoringAlgorithm(this.getColoringAlgorithm());
        this.multibrotShader.updateColors(basePalette);

        this.juliaShader.updateMaxIterations(this.getMaxIterations());
        this.juliaShader.updateBailOut(this.getBailOut());
        this.juliaShader.updateUniforms(juliaUniforms);
        this.juliaShader.updateVariables(juliaVariables);
        this.juliaShader.updateIterationsAlgorithm(multibrotIterations);
        this.juliaShader.updateColoringAlgorithm(this.getColoringAlgorithm());
        this.juliaShader.updateColors(basePalette);
    }

    /**
     * Gets the maximum iterations for the fractal calculation.
     * @returns The maximum iterations.
     */
    private getMaxIterations(): number {
        return parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
    }

    /**
     * Gets the bail-out value for the fractal calculation.
     * @returns The bail-out value.
     */
    private getBailOut(): number {
        return parseFloat((document.getElementById('bail-out') as HTMLInputElement).value);
    }

    /**
     * Gets the coloring algorithm for the fractal visualization.
     * @returns The coloring algorithm.
     */
    private getColoringAlgorithm(): string {
        const algorithmValue: string = (document.getElementById('color-alg') as HTMLSelectElement).value;

        let algorithm: string;
        switch (algorithmValue) {
            default:
            case "0":
                algorithm = grayscaleColoring;
                break;
            case"1":
                algorithm = discreteColoring;
                break;
            case "2":
                algorithm = linearColoring;
                break;
            case "3":
                algorithm = normalizedIterationCountColoring;
                break;
        }

        return algorithm;
    }

    /**
     * Gets the seed for the Julia set.
     * The seed is defined by the x and y coordinates in complex plane of the Mandelbrot set.
     * @returns The Julia seed.
     */
    private getJuliaSeed(): {x: number, y: number} {
        return {
            x: parseFloat((document.getElementById('julia-x') as HTMLInputElement).value),
            y: parseFloat((document.getElementById('julia-y') as HTMLInputElement).value)
        };
    }  

    /**
     * Gets the Multibrot canvas.
     * @returns The Multibrot canvas.
     */
    public get multibrotCanvas(): Canvas {
        return this.multibrot;
    }

    /**
     * Gets the Julia canvas.
     * @returns The Julia canvas.
     */
    public get juliaCanvas(): Canvas {
        return this.julia;
    }
}

const app = new Application();
app.start();