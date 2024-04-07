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
uniform vec2 position;

void main() {
    vec2 scale2 = vec2(scale, scale * resolution.y / resolution.x);

    // Calculate the position of the current pixel in the complex plane
    vec2 z = (gl_FragCoord.xy - resolution / 2.0) * (scale2 / resolution) - center;
    
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
        colorV = mix(colors[0], colors[1], a);
    } else if (a < 0.125) {
        colorV = mix(colors[1], colors[2], a);
    } else if (a < 0.1875) {
        colorV = mix(colors[2], colors[3], a);
    } else if (a < 0.25) {
        colorV = mix(colors[3], colors[4], a);
    } else if (a < 0.3125) {
        colorV = mix(colors[4], colors[5], a);
    } else if (a < 0.375) {
        colorV = mix(colors[5], colors[6], a);
    } else if (a < 0.4375) {
        colorV = mix(colors[6], colors[7], a);
    } else if (a < 0.5) {
        colorV = mix(colors[7], colors[8], a);
    } else if (a < 0.5625) {
        colorV = mix(colors[8], colors[9], a);
    } else if (a < 0.625) {
        colorV = mix(colors[9], colors[10], a);
    } else if (a < 0.6875) {
        colorV = mix(colors[10], colors[11], a);
    } else if (a < 0.75) {
        colorV = mix(colors[11], colors[12], a);
    } else if (a < 0.8125) {
        colorV = mix(colors[12], colors[13], a);
    } else if (a < 0.875) {
        colorV = mix(colors[13], colors[14], a);
    } else {
        colorV = mix(colors[14], colors[15], a);
    }

    gl_FragColor = vec4(colorV, 1.0);
}
