import juliaVariables from './shaders/variables/julia.glsl';
import multibrotVariables from './shaders/variables/multibrot.glsl';
import juliaUniforms from './shaders/uniforms/julia.glsl';
import multibrotIterations from './shaders/iterations/multibrot.glsl';
import { Settings } from './settings';
import { Canvas } from "./canvas";
import { Shader } from "./shader";
import { basePalette } from "./colors";
import { Input } from "./input";
import { InputEvent } from "./input_event";

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

        let size = Math.min(window.innerWidth/2, window.innerHeight);

        let width = size;
        let height = size;

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
        this.multibrot.canvasElement.id = "multibrot";

        this.julia.init();

        Settings.loadColorPalette(basePalette);
        
        new InputEvent(new Input(this));

        this.draw();
    }

    /**
     * Draws the Mandelbrot and Julia sets.
     */
    public draw(): void {
        this.setupShaders();

        this.multibrot.draw(this.multibrotShader);
        this.julia.draw(this.juliaShader, Settings.getJuliaSeed());
    }

    /**
     * Sets up shaders for Mandelbrot and Julia sets.
     */
    private setupShaders(): void {
        this.multibrotShader.updateExponent(Settings.getExponent());
        this.multibrotShader.updateMaxIterations(Settings.getMaxIterations());
        this.multibrotShader.updateBailOut(Settings.getBailOut());
        this.multibrotShader.updateVariables(multibrotVariables);
        this.multibrotShader.updateIterationsAlgorithm(multibrotIterations);
        this.multibrotShader.updateColoringAlgorithm(Settings.getColoringAlgorithm());
        this.multibrotShader.updateColors(Settings.getColorPalette());

        this.juliaShader.updateExponent(Settings.getExponent());
        this.juliaShader.updateMaxIterations(Settings.getMaxIterations());
        this.juliaShader.updateBailOut(Settings.getBailOut());
        this.juliaShader.updateUniforms(juliaUniforms);
        this.juliaShader.updateVariables(juliaVariables);
        this.juliaShader.updateIterationsAlgorithm(multibrotIterations);
        this.juliaShader.updateColoringAlgorithm(Settings.getColoringAlgorithm());
        this.juliaShader.updateColors(Settings.getColorPalette());
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