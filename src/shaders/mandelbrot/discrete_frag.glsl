// Define the maximum number of iterations for the Mandelbrot set calculation
// the value between the @ is replaced with the actual value during compilation,
// which can be set by the user in the application, that's because OpenGL doesn't support dynamic loops
const int MAX_ITERATIONS = @MAX_ITERATIONS@;

// Set the precision for floating-point operations
precision mediump float;

// Uniform variables representing the resolution of the screen,
// scaling factor, and center position of the Mandelbrot set
uniform vec2 resolution;
uniform float scale;
uniform vec2 center;
uniform vec3 colors[16];

void main() {

    vec2 scale2 = vec2(scale, scale * resolution.y / resolution.x);

    // Calculate the position of the current pixel in the complex plane
    vec2 position = (gl_FragCoord.xy - resolution / 2.0) * (scale2 / resolution) - center;
    
    // Initialize the complex number z to (0, 0)
    vec2 z = vec2(0.0, 0.0);
    
    // Initialize the iteration count to 0
    int iterations = 0;
    
    // Iterate to determine whether the current pixel is in the Mandelbrot set
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // Check if the magnitude of z exceeds 2, indicating it's not in the set
        if (length(z) > 2.0) {
            // Exit the loop if the escape condition is met
            break;
        }
            
        // Calculate the next iteration of z using the Mandelbrot formula
        vec2 newZ = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + position;
        
        // Update the value of z for the next iteration
        z = newZ;
        
        // Increment the iteration count
        iterations++;
    }

    float a = float(iterations) / float(MAX_ITERATIONS);
    vec3 colorV;

    if (a < 0.0625) {
        colorV = colors[0];
    } else if (a < 0.125) {
        colorV = colors[1];
    } else if (a < 0.1875) {
        colorV = colors[2];
    } else if (a < 0.25) {
        colorV = colors[3];
    } else if (a < 0.3125) {
        colorV = colors[4];
    } else if (a < 0.375) {
        colorV = colors[5];
    } else if (a < 0.4375) {
        colorV = colors[6];
    } else if (a < 0.5) {
        colorV = colors[7];
    } else if (a < 0.5625) {
        colorV = colors[8];
    } else if (a < 0.625) {
        colorV = colors[9];
    } else if (a < 0.6875) {
        colorV = colors[10];
    } else if (a < 0.75) {
        colorV = colors[11];
    } else if (a < 0.8125) {
        colorV = colors[12];
    } else if (a < 0.875) {
        colorV = colors[13];
    } else if (a < 0.9375) {
        colorV = colors[14];
    } else {
        colorV = colors[15];
    }

    gl_FragColor = vec4(colorV, 1.0);
}
