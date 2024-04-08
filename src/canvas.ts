import { Shader } from './shader';

export class Canvas {

    private readonly parent: HTMLElement;

    private wrappedWidth: number;
    private wrappedHeight: number;
    private wrappedScale: number = 4;
    private offset: {x: number, y: number} = {x: 0, y: 0};

    private canvas: HTMLCanvasElement;
    

    constructor(parent: HTMLElement, width: number, height: number) {
        this.parent = parent;
        this.width = width;
        this.height = height;
    }

    public init(): void {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.parent.appendChild(this.canvas);
    }

    public draw(shader: Shader, seed: {x: number, y: number} | null = null): void {
        const gl = this.canvas.getContext('webgl');

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        
        shader.assembleProgramSource();
        let shaderProgram = this.createShaderProgram(gl, shader.vertexShaderSource, shader.fragmentShaderSource);

        this.setUpVertexBuffer(gl, shaderProgram);
        this.setUpUniforms(gl, shader, shaderProgram, seed);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

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

    private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader: WebGLShader | null = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader as WebGLShader;
    }

    private setUpVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void {
        const positionAttributeLocation: number = gl.getAttribLocation(program, 'position');
        const positionBuffer: WebGLBuffer | null = gl.createBuffer();
    
        // Define vertices for a fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }

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

    public get width(): number {
        return this.wrappedWidth;
    }

    public set width(width: number) {
        this.wrappedWidth = width;
    }

    public get height(): number {
        return this.wrappedHeight;
    }

    public set height(height: number) {
        this.wrappedHeight = height;
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