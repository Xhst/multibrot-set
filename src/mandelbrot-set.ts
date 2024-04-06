import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

// Constant for scaling the Mandelbrot set visualization
const SCALE_MULTIPLIER = 2;

// Call the function to initialize and prepare the Mandelbrot set visualization
prepareMandelbroSet();

/**
 * Initializes and prepares the Mandelbrot set visualization.
 */
function prepareMandelbroSet(): void {
    // Create a canvas element and get WebGL context
    const canvas: HTMLCanvasElement = createCanvas();
    const gl: WebGLRenderingContext | null = canvas.getContext('webgl');

    // Check if WebGL is supported
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    // Draw the Mandelbrot set
    drawMandelbrotSet(canvas, gl);
}

/**
 * Creates a canvas element and appends it to the document body.
 * @returns The created canvas element.
 */
function createCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas;
}

/**
 * Creates a shader given its type and source code.
 * @param gl The WebGL rendering context.
 * @param type The type of the shader (e.g., gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
 * @param source The source code of the shader.
 * @returns The compiled shader.
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader: WebGLShader | null = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader as WebGLShader;
}

/**
 * Creates a shader program by compiling vertex and fragment shaders.
 * @param gl The WebGL rendering context.
 * @param max_iterations The maximum number of iterations for the Mandelbrot set calculation.
 * @returns The created shader program.
 */
function createShaderProgram(gl: WebGLRenderingContext, max_iterations: number): WebGLProgram {
    let vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource.replace('@MAX_ITERATIONS@', String(max_iterations)));
    
    const program: WebGLProgram | null = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    return program as WebGLProgram;
}

/**
 * Sets up the vertex buffer.
 * @param gl The WebGL rendering context.
 * @param program The shader program.
 */
function setUpVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void {
    const positionAttributeLocation: number = gl.getAttribLocation(program, 'position');
    const positionBuffer: WebGLBuffer | null = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

/**
 * Sets up uniforms for the shader program.
 * @param gl The WebGL rendering context.
 * @param program The shader program.
 * @param canvas The canvas element.
 * @returns An object containing references to scale, center, and params uniform locations.
 */
function setUpUniforms(gl: WebGLRenderingContext, program: WebGLProgram, canvas: HTMLCanvasElement): {scaleUniformLocation: WebGLUniformLocation, centerUniformLocation: WebGLUniformLocation, params: {x: number, y: number, z: number}} {
    const params: {x: number, y: number, z: number} = {x: -0.5, y: 0.0, z: 1.0};
    const resolutionUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionUniformLocation as WebGLUniformLocation, canvas.width, canvas.height);

    const scaleUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'scale');
    gl.uniform1f(scaleUniformLocation as WebGLUniformLocation, canvas.width / (SCALE_MULTIPLIER * Math.exp(params.z)));

    const centerUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'center');
    gl.uniform2f(centerUniformLocation as WebGLUniformLocation, params.x, params.y);

    return { scaleUniformLocation: scaleUniformLocation as WebGLUniformLocation, centerUniformLocation: centerUniformLocation as WebGLUniformLocation, params };
}

/**
 * Adds event listeners for interaction with the Mandelbrot set visualization.
 * @param gl The WebGL rendering context.
 * @param canvas The canvas element.
 * @param scaleUniformLocation The uniform location for the scale parameter.
 * @param centerUniformLocation The uniform location for the center parameter.
 * @param params An object containing the current values of the x, y, and z parameters.
 */
function addEventListeners(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, scaleUniformLocation: WebGLUniformLocation,
     centerUniformLocation: WebGLUniformLocation, params: {x: number, y: number, z: number}
): void {
    document.getElementById('max-iterations-btn')!.addEventListener('click', () => {
        const maxIterations: number = parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
        
        console.log('Drawing Mandelbrot set with max iterations:', maxIterations);
        drawMandelbrotSet(canvas, gl, maxIterations);
    });

    // Add arrow key and other key event listeners for scaling and interaction
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        const arrowKeys: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const wasdKeys: string[] = ['w', 'a', 's', 'd'];
        const zxKeys: string[] = ['z', 'x'];
        if (arrowKeys.includes(event.key) || wasdKeys.includes(event.key) || zxKeys.includes(event.key)) {
            event.preventDefault();
            const scaleStep: number = 0.01;
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    params.y += scaleStep;
                    break;
                case 'ArrowDown':
                case 's':
                    params.y -= scaleStep;
                    break;
                case 'ArrowLeft':
                case 'a':
                    params.x -= scaleStep;
                    break;
                case 'ArrowRight':
                case 'd':
                    params.x += scaleStep;
                    break;
                case 'z':
                    params.z += scaleStep;
                    break;
                case 'x':
                    params.z -= scaleStep;
                    break;
            }
            gl.uniform1f(scaleUniformLocation, canvas.width / (SCALE_MULTIPLIER * Math.exp(params.z)));
            gl.uniform2f(centerUniformLocation, params.x, params.y);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    });
}

/**
 * Draws the Mandelbrot set on the canvas.
 * @param canvas The canvas element.
 * @param gl The WebGL rendering context.
 * @param max_iterations The maximum number of iterations for the Mandelbrot set calculation.
 */
function drawMandelbrotSet(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, max_iterations: number = 100): void {
    let program: WebGLProgram = createShaderProgram(gl, max_iterations);

    setUpVertexBuffer(gl, program);
    let { scaleUniformLocation, centerUniformLocation, params } = setUpUniforms(gl, program, canvas);

    addEventListeners(gl, canvas, scaleUniformLocation, centerUniformLocation, params);

    // Render the Mandelbrot set
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
