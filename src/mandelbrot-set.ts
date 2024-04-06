import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

prepareMandelbroSet();

function prepareMandelbroSet() {
    const canvas = createCanvas();
    const gl = canvas.getContext('webgl');

    if (!gl) {
        throw new Error('WebGL not supported');
    }

    drawMandelbrotSet(canvas, gl);
}

function drawMandelbrotSet(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, max_iterations: number = 100) {
    let program = createShaderProgram(gl, max_iterations);

    setUpVertexBuffer(gl, program);
    let { scaleUniformLocation, centerUniformLocation, params } = setUpUniforms(gl, program, canvas);

    addEventListeners(gl, canvas, scaleUniformLocation, centerUniformLocation, params);

    // Render the Mandelbrot set
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}

function createCanvas() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createShaderProgram(gl: WebGLRenderingContext, max_iterations: number) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource.replace('@MAX_ITERATIONS@', String(max_iterations)));
    
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}

function setUpVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

function setUpUniforms(gl: WebGLRenderingContext, program: WebGLProgram, canvas: HTMLCanvasElement) {
    const params = {x: -0.5, y: 0.0, z: 1.0};
    const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    const scaleUniformLocation = gl.getUniformLocation(program, 'scale');
    gl.uniform1f(scaleUniformLocation, canvas.width / (4 * params.z));

    const centerUniformLocation = gl.getUniformLocation(program, 'center');
    gl.uniform2f(centerUniformLocation, params.x, params.y);

    return { scaleUniformLocation, centerUniformLocation, params };
}

function addEventListeners(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, scaleUniformLocation: WebGLUniformLocation,
     centerUniformLocation: WebGLUniformLocation, params: {x: number, y: number, z: number}
) {
    document.getElementById('max-iterations-btn').addEventListener('click', () => {
        const maxIterations = parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
        
        console.log('Drawing Mandelbrot set with max iterations:', maxIterations);
        drawMandelbrotSet(canvas, gl, maxIterations);
    });

    // Add arrow key scaling
    window.addEventListener('keydown', (event) => {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const wasdKeys = ['w', 'a', 's', 'd'];
        const zxKeys = ['z', 'x'];
        if (arrowKeys.includes(event.key) || wasdKeys.includes(event.key) || zxKeys.includes(event.key)) {
            event.preventDefault();
            const scaleStep = 0.01;
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
            gl.uniform1f(scaleUniformLocation, canvas.width / (4 * Math.exp(params.z)));
            gl.uniform2f(centerUniformLocation, params.x, params.y);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    });
}