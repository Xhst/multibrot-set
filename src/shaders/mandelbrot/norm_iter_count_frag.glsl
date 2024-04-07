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
    
    // Initialize the escape radius
    float escapeRadius = 20.0;
    
    // Iterate to determine whether the current pixel is in the Mandelbrot set
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // Check if the magnitude of z exceeds the escape radius, indicating it's not in the set
        if (length(z) > escapeRadius) {
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

    iterations = iterations - (iterations / 16) * 16;

    // Calculate the normalized iteration count
    float normalizedIterations = float(iterations) + 1.0 - (log(log(length(z)) / log(2.0))) / log(2.0);

    vec3 color = vec3(0.0);
    int idx = int(normalizedIterations);
    for (int i = 0; i < 16; i++) {
        if (i == idx) {
            color = mix(colors[i], colors[i + 1], fract(normalizedIterations));
            break;
        }
    }
    
    // Output the final color for the current pixel
    gl_FragColor = vec4(color, 1.0);
}
