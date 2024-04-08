import { Canvas } from "./canvas";
import { Shader } from "./shader";
import { basePalette } from "./colors";
import { InputHandler } from "./input_handler";
import juliaVariables from './shaders/variables/julia.glsl';
import mandelbrotVariables from './shaders/variables/mandelbrot.glsl';
import juliaUniforms from './shaders/uniforms/julia.glsl';
import mandelbrotIterations from './shaders/iterations/mandelbrot.glsl';
import grayscaleColoring from './shaders/coloring/grayscale.glsl';
import discreteColoring from './shaders/coloring/discrete.glsl';
import linearColoring from './shaders/coloring/linear.glsl';
import normalizedIterationCountColoring from './shaders/coloring/normalized_iteration_count.glsl';

export class Application {

    private readonly canvasContainer: HTMLElement;

    private readonly mandelbrot: Canvas;
    private readonly julia: Canvas;

    private mandelbrotShader: Shader;
    private juliaShader: Shader;

    constructor() {
        this.canvasContainer = document.getElementById("canvas-container");

        let sideBySide: boolean = (document.getElementById('side-by-side') as HTMLInputElement).checked
        let width = sideBySide ? window.innerWidth/2 : window.innerWidth;
        let height = window.innerHeight;

        this.mandelbrot = new Canvas(this.canvasContainer, width, height);
        this.julia = new Canvas(this.canvasContainer, width, height);

        this.mandelbrotShader = new Shader();
        this.juliaShader = new Shader();
    }

    public start(): void {
        this.mandelbrot.init();
        this.julia.init();
        
        new InputHandler(this);

        this.draw();
    }

    public draw(): void {
        this.setupShaders();

        this.mandelbrot.draw(this.mandelbrotShader);
        this.julia.draw(this.juliaShader, this.getJuliaSeed());
    }

    private setupShaders(): void {
        this.mandelbrotShader.updateMaxIterations(this.getMaxIterations());
        this.mandelbrotShader.updateVariables(mandelbrotVariables);
        this.mandelbrotShader.updateIterationsAlgorithm(mandelbrotIterations);
        this.mandelbrotShader.updateColoringAlgorithm(this.getColoringAlgorithm());
        this.mandelbrotShader.updateColors(basePalette);

        this.juliaShader.updateMaxIterations(this.getMaxIterations());
        this.juliaShader.updateUniforms(juliaUniforms);
        this.juliaShader.updateVariables(juliaVariables);
        this.juliaShader.updateIterationsAlgorithm(mandelbrotIterations);
        this.juliaShader.updateColoringAlgorithm(this.getColoringAlgorithm());
        this.juliaShader.updateColors(basePalette);
    }

    private getMaxIterations(): number {
        return parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
    }

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

    private getJuliaSeed(): {x: number, y: number} {
        return {
            x: parseFloat((document.getElementById('julia-x') as HTMLInputElement).value),
            y: parseFloat((document.getElementById('julia-y') as HTMLInputElement).value)
        };
    }  

    public get mandelbrotCanvas(): Canvas {
        return this.mandelbrot;
    }

    public get juliaCanvas(): Canvas {
        return this.julia;
    }
}

const app = new Application();
app.start();