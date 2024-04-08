
for (int i = 0; i < MAX_ITERATIONS; i++) {
    // Check if the magnitude of z exceeds 2, indicating it's not in the set
    if (length(z) > 2.0) {
        // Exit the loop if the escape condition is met
        break;
    }
        
    // Calculate the next iteration of z using the Mandelbrot formula
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + position;
    
    // Increment the iteration count
    iterations++;
}