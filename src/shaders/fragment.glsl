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

void main() {
    // Calculate the position of the current pixel in the complex plane
    vec2 position = (gl_FragCoord.xy - resolution / 2.0) / scale + center;
    
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
    
    // Calculate the color based on the number of iterations
    float color = float(iterations) / float(MAX_ITERATIONS);
    
    // Output the final color for the current pixel
    gl_FragColor = vec4(color, color, color, 1.0);
}
