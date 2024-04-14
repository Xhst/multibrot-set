import { Shader } from './shader';

/**
 * Represents a canvas for rendering fractals using WebGL.
 */
export class Canvas {

    /**
     * Parent element where the canvas is appended.
     */
    private readonly parent: HTMLElement;

    private wrappedWidth: number;
    private wrappedHeight: number;
    private wrappedScale: number = 4;
    private offset: {x: number, y: number} = {x: 0, y: 0};

    private canvas: HTMLCanvasElement;
    
    /**
     * Creates an instance of Canvas.
     * @param parent - Parent element where the canvas will be appended.
     * @param width - Initial width of the canvas.
     * @param height - Initial height of the canvas.
     */
    constructor(parent: HTMLElement, width: number, height: number) {
        this.parent = parent;
        this.wrappedWidth = width;
        this.wrappedHeight = height;
    }

    /**
     * Initializes the canvas element.
     */
    public init(): void {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.parent.appendChild(this.canvas);
    }

    /**
     * Draws the fractal on the canvas using the provided shader.
     * @param shader - Shader to use for rendering the fractal.
     * @param seed - Optional seed for the fractal (for Julia sets).
     */
    public draw(shader: Shader, seed: {x: number, y: number} | null = null): void {
        const gl = this.canvas.getContext('webgl');

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        shader.assembleProgramSource();
        let shaderProgram = this.createShaderProgram(gl, shader.vertexShaderSource, shader.fragmentShaderSource);

        this.setUpVertexBuffer(gl, shaderProgram);
        this.setUpUniforms(gl, shader, shaderProgram, seed);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * Creates a shader program.
     * @param gl - WebGLRenderingContext for creating the program.
     * @param vertexShaderSource - Source code of the vertex shader.
     * @param fragmentShaderSource - Source code of the fragment shader.
     * @returns The created shader program.
     */
    private createShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        gl.useProgram(program);

        return program;
    }

    /**
     * Creates a shader object.
     * @param gl - WebGLRenderingContext for creating the shader.
     * @param type - Type of the shader (VERTEX_SHADER or FRAGMENT_SHADER).
     * @param source - Source code of the shader.
     * @returns The created shader object.
     */
    private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader: WebGLShader | null = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader as WebGLShader;
    }

    /**
     * Sets up the vertex buffer for the shader program.
     * @param gl - WebGLRenderingContext for setting up the buffer.
     * @param program - Shader program for which the buffer is set up.
     */
    private setUpVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void {
        const positionAttributeLocation: number = gl.getAttribLocation(program, 'position');
        const positionBuffer: WebGLBuffer | null = gl.createBuffer();
    
        // Define vertices for a fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }

    /**
     * Sets up the uniforms for the shader program.
     * @param gl - WebGLRenderingContext for setting up the uniforms.
     * @param shader - Shader object containing uniform data.
     * @param program - Shader program for which the uniforms are set up.
     * @param seed - Optional seed for the fractal (for Julia sets).
     */
    private setUpUniforms(gl: WebGLRenderingContext, shader: Shader, program: WebGLProgram, 
        seed: {x: number, y: number} | null = null): void {
        const resolutionUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'resolution');
        const scaleUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'scale');
        const offsetUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'offset');
        const colorsUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'colors');
        const positionUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'position');

        if (resolutionUniformLocation) {
            gl.uniform2f(resolutionUniformLocation, this.width, this.height);
        }

        if (scaleUniformLocation) {
            gl.uniform1f(scaleUniformLocation, this.wrappedScale);
        }

        if (offsetUniformLocation) {
            gl.uniform2f(offsetUniformLocation, this.offset.x, this.offset.y);
        }

        if (colorsUniformLocation) {
            const colorsArray: number[] = shader.getColors().flatMap(color => [color.r, color.g, color.b]);
            gl.uniform3fv(colorsUniformLocation as WebGLUniformLocation, colorsArray);
        }

        if (positionUniformLocation) {
            if (!seed) {
                seed = {x: 0, y: 0};
            }
            gl.uniform2f(positionUniformLocation, seed.x, seed.y);
        }
    }

    /**
     * Converts the canvas to a data URL.
     * @returns The data URL of the canvas.
     */
    public toDataURL() {
        const gl = this.canvas.getContext('webgl');

        // redraw the canvas to avoid black background
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        return this.canvas.toDataURL("image/png");
    }

    /**
     * Saves the canvas as an image.
     * @param filename - Name of the file to save the canvas as.
     */
    public saveAsImage(filename: string = 'fractal.png') {
        let link = document.createElement('a');
        link.target = '_blank';
        link.download = filename;
        link.href = this.toDataURL();
        link.click();
    }

    /**
     * Gets the image data of the canvas.
     * @param x - X coordinate of the upper-left corner of the rectangle to capture.
     * @param y - Y coordinate of the upper-left corner of the rectangle to capture.
     * @param width - Width of the rectangle to capture.
     * @param height - Height of the rectangle to capture.
     * @returns The image data of the canvas.
     */
    public getImageData(x: number = 0, y: number = 0, width: number = this.width, height: number = this.height): ImageData {
        const gl = this.canvas.getContext('webgl');

        // Create a buffer to store the pixels
        let pixels = new Uint8Array(width * height * 4);

        // Read the pixels from the canvas and store them in the buffer
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        return new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
    }

    public get width(): number {
        return this.wrappedWidth;
    }

    public set width(width: number) {
        this.wrappedWidth = width;
        this.canvas.width = width;
    }

    public get height(): number {
        return this.wrappedHeight;
    }

    public set height(height: number) {
        this.wrappedHeight = height;
        this.canvas.height = height;
    }

    public get canvasElement(): HTMLCanvasElement {
        return this.canvas;
    }

    public get scale(): number {
        return this.wrappedScale;
    }

    public set scale(scale: number) {
        this.wrappedScale = scale;
    }

    public get offsetX(): number {
        return this.offset.x;
    }

    public get offsetY(): number {
        return this.offset.y;
    }

    public set offsetX(x: number) {
        this.offset.x = x;
    }

    public set offsetY(y: number) {
        this.offset.y = y;
    }
}