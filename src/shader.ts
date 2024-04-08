import fragmentShaderSource from './shaders/fragment.glsl';
import vertexShaderSource from './shaders/vertex.glsl';
import { Color } from './colors';

export class Shader {

    private readonly shaderOptions: ShaderOptions;
    private wrappedFragmentShaderSource: string;
    private wrappedVertexShaderSource: string;

    constructor() {
        this.shaderOptions = {
            maxIterations: 100,
            bailOut: 2.0,
            colors: [
                { r: 0, g: 0, b: 0 },
            ],
            uniforms: '',
            variables: '',
            iterationsAlgorithm: '',
            coloringAlgorithm: ''
        }
    }

    public updateMaxIterations(maxIterations: number): void {
        this.shaderOptions.maxIterations = maxIterations;
    }

    public updateBailOut(bailOut: number): void {
        this.shaderOptions.bailOut = bailOut;
    }

    public updateColors(colors: Array<Color>): void {
        this.shaderOptions.colors = colors;
    }

    public updateUniforms(uniforms: string): void {
        this.shaderOptions.uniforms = uniforms;
    }

    public updateVariables(variables: string): void {
        this.shaderOptions.variables = variables;
    }

    public updateIterationsAlgorithm(iterationsAlgorithm: string): void {
        this.shaderOptions.iterationsAlgorithm = iterationsAlgorithm;
    }

    public updateColoringAlgorithm(coloringAlgorithm: string): void {
        this.shaderOptions.coloringAlgorithm = coloringAlgorithm;
    }

    public assembleProgramSource(): void {
        this.wrappedFragmentShaderSource = fragmentShaderSource
            .replace('@MAX_ITERATIONS@', this.shaderOptions.maxIterations.toString())
            .replace('@BAILOUT@', this.shaderOptions.bailOut.toFixed(2).toString())
            .replace('@COLORS_COUNT@', this.shaderOptions.colors.length.toString())
            .replace('@UNIFORMS@', this.shaderOptions.uniforms)
            .replace('@VARIABLES@', this.shaderOptions.variables)
            .replace('@ITERATIONS_ALGORITHM@', this.shaderOptions.iterationsAlgorithm)
            .replace('@COLORING_ALGORITHM@', this.shaderOptions.coloringAlgorithm);

        this.wrappedVertexShaderSource = vertexShaderSource;
    }

    public getColors(): Array<Color> {
        return this.shaderOptions.colors;
    }

    public get fragmentShaderSource(): string {
        return this.wrappedFragmentShaderSource;
    }

    public get vertexShaderSource(): string {
        return this.wrappedVertexShaderSource;
    }
}

export type ShaderOptions = {
    maxIterations: number;
    bailOut: number;
    colors: Array<Color>;
    uniforms: string,
    variables: string;
    iterationsAlgorithm: string;
    coloringAlgorithm: string;
}