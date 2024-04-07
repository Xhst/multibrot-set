import vertexShaderSource from './shaders/vertex.glsl';
import m_grayscale from './shaders/mandelbrot/grayscale_frag.glsl';
import j_grayscale from './shaders/julia/grayscale_frag.glsl';
import m_discrete from './shaders/mandelbrot/discrete_frag.glsl';
import j_discrete from './shaders/julia/discrete_frag.glsl';
import m_linear from './shaders/mandelbrot/linear_frag.glsl';
import j_linear from './shaders/julia/linear_frag.glsl';
import m_norm_iter_count from './shaders/mandelbrot/norm_iter_count_frag.glsl';
import j_norm_iter_count from './shaders/julia/norm_iter_count_frag.glsl';

type Color = {
    r: number;
    g: number;
    b: number;
};


// Step size for zooming and movement
const SCALE_STEP: number = 0.01;

// Variable to hold interval reference for continuous movement
let interval: NodeJS.Timeout | null = null;

let global_position: { x: number, y: number, z: number } = { x: 0.25, y: 0, z: 4 };

let julia_position: { x: number, y: number } = { x: 0.285, y: 0.01 };

let colors: Array<Color> = [
    {r: 9/255, g: 1/255, b: 47/255},
    {r: 4/255, g: 4/255, b: 73/255},
    {r: 0/255, g: 7/255, b: 100/255},
    {r: 12/255, g: 44/255, b: 138/255},
    {r: 24/255, g: 82/255, b: 177/255},
    {r: 57/255, g: 125/255, b: 209/255},
    {r: 134/255, g: 181/255, b: 229/255},
    {r: 211/255, g: 236/255, b: 248/255},
    {r: 241/255, g: 233/255, b: 191/255},
    {r: 248/255, g: 201/255, b: 95/255},
    {r: 255/255, g: 170/255, b: 0/255},
    {r: 204/255, g: 128/255, b: 0/255},
    {r: 153/255, g: 87/255, b: 0/255},
    {r: 106/255, g: 52/255, b: 3/255},
    {r: 66/255, g: 30/255, b: 15/255},
    {r: 25/255, g: 7/255, b: 26/255},
];

main()

function main() {
    const mandelbrotCanvas = prepareMandelbroSet();
    const juliaCanvas = prepareJuliaSet();

    addEventListeners(mandelbrotCanvas, juliaCanvas);
}

/**
 * Initializes and prepares the Mandelbrot set visualization.
 */
function prepareMandelbroSet() {
    // Create a canvas element and get WebGL context
    const canvas: HTMLCanvasElement = createCanvas();
    const gl: WebGLRenderingContext | null = canvas.getContext('webgl');

    // Check if WebGL is supported
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    // Draw the Mandelbrot set
    drawMandelbrotSet(canvas);

    return canvas;
}

/**
 * Draws the Mandelbrot set on the canvas.
 * @param canvas The canvas element.
 * @param max_iterations The maximum number of iterations for the Mandelbrot set calculation.
 */
function drawMandelbrotSet(canvas: HTMLCanvasElement): void {
    const gl = canvas.getContext('webgl');

    const max_iterations = parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
    const algorithmValue: string = (document.getElementById('color-alg') as HTMLSelectElement).value

    let algorithm: string
    switch (algorithmValue) {
        default:
        case "0":
            algorithm = m_grayscale
            break;
        case"1":
            algorithm = m_discrete
            break;
        case "2":
            algorithm = m_linear
            break;
        case "3":
            algorithm = m_norm_iter_count
            break
    }

    const program: WebGLProgram = createShaderProgram(gl, max_iterations, algorithm);

    setUpVertexBuffer(gl, program);
    setUpUniforms(canvas);

    // Render the Mandelbrot set
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function prepareJuliaSet() {
    // Create a canvas element and get WebGL context
    const canvas: HTMLCanvasElement = createCanvas();
    const gl: WebGLRenderingContext | null = canvas.getContext('webgl');

    // Check if WebGL is supported
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    // Draw the Julia set
    drawJuliaSet(canvas);

    return canvas;
}

function drawJuliaSet(canvas: HTMLCanvasElement): void {
    const gl = canvas.getContext('webgl');

    const max_iterations = parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
    const algorithmValue: string = (document.getElementById('color-alg') as HTMLSelectElement).value

    let algorithm: string
    switch (algorithmValue) {
        default:
        case "0":
            algorithm = j_grayscale
            break;
        case"1":
            algorithm = j_discrete
            break;
        case "2":
            algorithm = j_linear
            break;
        case "3":
            algorithm = j_norm_iter_count
            break
    }

    const program: WebGLProgram = createShaderProgram(gl, max_iterations, algorithm);

    setUpVertexBuffer(gl, program);
    setUpUniforms(canvas, julia_position);

    // Render the Julia set
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


/**
 * Creates a canvas element and appends it to the document body.
 * @returns The created canvas element.
 */
function createCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    document.getElementById('canvas-container')!.appendChild(canvas);

    let sideBySide: boolean = (document.getElementById('side-by-side') as HTMLInputElement).checked
    canvas.width = sideBySide ? window.innerWidth/2 : window.innerWidth;
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
function createShaderProgram(gl: WebGLRenderingContext, max_iterations: number, fragmentShaderSource: string): WebGLProgram {
    const vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource.replace('@MAX_ITERATIONS@', String(max_iterations)));
    
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

    // Define vertices for a fullscreen quad
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
 * @returns An object containing references to scale, center, and global_position uniform locations.
 */
function setUpUniforms(canvas: HTMLCanvasElement, position: {x: number, y: number} | undefined = undefined) {
    const gl: WebGLRenderingContext = canvas.getContext('webgl');
    const program: WebGLProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    // Set resolution uniform
    const resolutionUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionUniformLocation as WebGLUniformLocation, canvas.width, canvas.height);

    // Set scale uniform
    const scaleUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'scale');
    gl.uniform1f(scaleUniformLocation as WebGLUniformLocation, global_position.z);

    // Set center uniform
    const centerUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'center');
    gl.uniform2f(centerUniformLocation as WebGLUniformLocation, global_position.x, global_position.y);

    // Set colors uniform
    const colorsUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'colors');
    const colorsArray: number[] = colors.flatMap(color => [color.r, color.g, color.b]);
    gl.uniform3fv(colorsUniformLocation as WebGLUniformLocation, colorsArray);

    if (position != undefined) {
        const positionUniformLocation: WebGLUniformLocation | null = gl.getUniformLocation(program, 'position');
        gl.uniform2f(positionUniformLocation, position.x, position.y);
    }
}


/**
 * Updates uniforms for the shader program.
 * @param gl The WebGL rendering context.
 * @param canvas The canvas element.
 * @param scaleUniformLocation The uniform location for the scale parameter.
 * @param centerUniformLocation The uniform location for the center parameter.
 * @param global_position An object containing the current values of the x, y, and z parameters.
 */
function updateUniforms(canvas: HTMLCanvasElement) {
    const gl: WebGLRenderingContext = canvas.getContext('webgl');
    const program: WebGLProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    // Update resolution uniform
    gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);

    // Update scale and center uniforms
    gl.uniform1f(gl.getUniformLocation(program, 'scale'), global_position.z);

    gl.uniform2f(gl.getUniformLocation(program, 'center'), global_position.x, global_position.y);
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function updateJuliaPositions(x: number, y: number) {
    julia_position.x = x;
    julia_position.y = y;

    (document.getElementById('julia-x') as HTMLInputElement).value = x.toFixed(6);
    (document.getElementById('julia-y') as HTMLInputElement).value = y.toFixed(6);

}

function updateJuliaUniforms(canvas: HTMLCanvasElement) {
    const gl: WebGLRenderingContext = canvas.getContext('webgl');
    const program: WebGLProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    gl.uniform1f(gl.getUniformLocation(program, 'scale'), global_position.z);

    gl.uniform2f(gl.getUniformLocation(program, 'center'), 
        global_position.x, global_position.y);

    gl.uniform2f(gl.getUniformLocation(program, 'position'), 
        julia_position.x, julia_position.y);
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


/**
 * Adds event listeners for interaction with the Mandelbrot set visualization.
 * @param gl The WebGL rendering context.
 * @param canvas The canvas element.
 * @param scaleUniformLocation The uniform location for the scale parameter.
 * @param centerUniformLocation The uniform location for the center parameter.
 * @param global_position An object containing the current values of the x, y, and z parameters.
 */
function addEventListeners(mandelbrotCanvas: HTMLCanvasElement, juliaCanvas: HTMLCanvasElement) {
    
    // Add event listener to clear interval on mouseup
    document.addEventListener('mouseup', () => {
        if (interval) {
            clearInterval(interval);
        }
    });

    // Add event listener to clear interval on touchend
    document.addEventListener('touchend', () => {
        if (interval) {
            clearInterval(interval);
        }
    });

    // Event listener for changing maximum iterations
    document.getElementById('max-iterations-btn')!.addEventListener('click', () => {
        const maxIterations: number = parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);

        const juliaPositionX: number = parseFloat((document.getElementById('julia-x') as HTMLInputElement).value);
        const juliaPositionY: number = parseFloat((document.getElementById('julia-y') as HTMLInputElement).value);
        updateJuliaPositions(juliaPositionX, juliaPositionY);

        console.log('Drawing Mandelbrot set with max iterations:', maxIterations);

        drawMandelbrotSet(mandelbrotCanvas);
        drawJuliaSet(juliaCanvas);
    });

    document.getElementById('side-by-side')!.addEventListener('change', () => {
        const sideBySide: boolean = (document.getElementById('side-by-side') as HTMLInputElement).checked
        mandelbrotCanvas.width = sideBySide ? window.innerWidth/2 : window.innerWidth;
        mandelbrotCanvas.height = window.innerHeight;
        juliaCanvas.width = sideBySide ? window.innerWidth/2 : window.innerWidth;
        juliaCanvas.height = window.innerHeight;

        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });
    document.getElementById('color-alg')!.addEventListener('change', () => {        
        drawMandelbrotSet(mandelbrotCanvas);
        drawJuliaSet(juliaCanvas);
    });



    mandelbrotCanvas.addEventListener('click', (event: MouseEvent) => {
        updateJuliaPosition(event);
    });
    mandelbrotCanvas.addEventListener('mousedown', (event: MouseEvent) => {
        interval = setInterval(() => {
            updateJuliaPosition(event);
        }, 100);
    });
    mandelbrotCanvas.addEventListener('touchstart', (event: TouchEvent) => {
        interval = setInterval(() => {
            updateJuliaPosition(event);
        }, 100);
    });

    // Get the pointer coordinates on the canvas
    const updateJuliaPosition = (event: MouseEvent | TouchEvent) => {
        const rect: DOMRect = mandelbrotCanvas.getBoundingClientRect();
        const clientX: number = ((event instanceof MouseEvent) ? event.clientX : (event.touches[0].clientX)) - rect.left;
        const clientY: number = ((event instanceof MouseEvent) ? event.clientY : (event.touches[0].clientY)) - rect.top;

        
        const fragX = clientX
        const fragY = mandelbrotCanvas.height - clientY

        const x = ((fragX - (mandelbrotCanvas.width / 2)) * (global_position.z / mandelbrotCanvas.width)) - global_position.x;
        const y = ((fragY - (mandelbrotCanvas.height / 2)) * (global_position.z / mandelbrotCanvas.width)) - global_position.y;
        
        console.log(clientX, clientY, x, y)
        
        updateJuliaPositions(x, y);

        updateJuliaUniforms(juliaCanvas)
    };

    // Event listeners for movements and zooming (touch)
    document.getElementById('move-down')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.y -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-up')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.y += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-left')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.x -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-right')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.x += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('zoom-out')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.z -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('zoom-in')!.addEventListener('touchstart', () => {
        interval = setInterval(() => {
            global_position.z += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    // Event listeners for movements and zooming (mouse)
    document.getElementById('move-down')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.y -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-up')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.y += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-left')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.x -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('move-right')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.x += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('zoom-out')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.z -= SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    document.getElementById('zoom-in')!.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            global_position.z += SCALE_STEP;
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }, 100);
    });

    // Event listeners for discrete movements and zooming
    document.getElementById('move-down')!.addEventListener('click', () => {
        global_position.y -= SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    document.getElementById('move-up')!.addEventListener('click', () => {
        global_position.y += SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    document.getElementById('move-left')!.addEventListener('click', () => {
        global_position.x -= SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    document.getElementById('move-right')!.addEventListener('click', () => {
        global_position.x += SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    document.getElementById('zoom-out')!.addEventListener('click', () => {
        global_position.z -= SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    document.getElementById('zoom-in')!.addEventListener('click', () => {
        global_position.z += SCALE_STEP;
        updateUniforms(mandelbrotCanvas);
        updateUniforms(juliaCanvas);
    });

    // Event listener for keyboard controls
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        const arrowKeys: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const wasdKeys: string[] = ['w', 'a', 's', 'd'];
        const zxKeys: string[] = ['z', 'x'];
        if (arrowKeys.includes(event.key) || wasdKeys.includes(event.key) || zxKeys.includes(event.key)) {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    global_position.y += SCALE_STEP;
                    break;
                case 'ArrowDown':
                case 's':
                    global_position.y -= SCALE_STEP;
                    break;
                case 'ArrowLeft':
                case 'a':
                    global_position.x -= SCALE_STEP;
                    break;
                case 'ArrowRight':
                case 'd':
                    global_position.x += SCALE_STEP;
                    break;
                case 'z':
                    global_position.z += SCALE_STEP;
                    break;
                case 'x':
                    global_position.z -= SCALE_STEP;
                    break;
            }
            updateUniforms(mandelbrotCanvas);
            updateUniforms(juliaCanvas);
        }
    });
}