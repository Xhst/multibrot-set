import fragmentShaderSource from './shaders/fragment.glsl';
import vertexShaderSource from './shaders/vertex.glsl';
import { Color } from './colors';

/**
 * Represents a shader used for rendering fractals.
 */
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

    /**
     * Updates the maximum number of iterations for the fractal calculation.
     * @param maxIterations - The maximum number of iterations.
     */
    public updateMaxIterations(maxIterations: number): void {
        this.shaderOptions.maxIterations = maxIterations;
    }

    /**
     * Updates the bail-out value for the fractal calculation.
     * @param bailOut - The bail-out value.
     */
    public updateBailOut(bailOut: number): void {
        this.shaderOptions.bailOut = bailOut;
    }

    /**
     * Updates the colors used in the shader.
     * @param colors - An array of colors.
     */
    public updateColors(colors: Array<Color>): void {
        this.shaderOptions.colors = colors;
    }

    /**
     * Updates the uniforms used in the shader program.
     * @param uniforms - Uniforms string for the shader program.
     */
    public updateUniforms(uniforms: string): void {
        this.shaderOptions.uniforms = uniforms;
    }

    /**
     * Updates the variables used in the shader program.
     * @param variables - Variables string for the shader program.
     */
    public updateVariables(variables: string): void {
        this.shaderOptions.variables = variables;
    }

    /**
     * Updates the iterations algorithm used in the shader program.
     * @param iterationsAlgorithm - Iterations algorithm string for the shader program.
     */
    public updateIterationsAlgorithm(iterationsAlgorithm: string): void {
        this.shaderOptions.iterationsAlgorithm = iterationsAlgorithm;
    }

    /**
     * Updates the coloring algorithm used in the shader program.
     * @param coloringAlgorithm - Coloring algorithm string for the shader program.
     */
    public updateColoringAlgorithm(coloringAlgorithm: string): void {
        this.shaderOptions.coloringAlgorithm = coloringAlgorithm;
    }

    /**
     * Assembles the source code of the shader program.
     */
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

    /**
     * Gets the colors used in the shader.
     * @returns An array of colors.
     */
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

/**
 * Represents options for configuring a shader.
 */
export type ShaderOptions = {
    maxIterations: number;
    bailOut: number;
    colors: Array<Color>;
    uniforms: string,
    variables: string;
    iterationsAlgorithm: string;
    coloringAlgorithm: string;
}