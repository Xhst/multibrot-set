
// The power of the Multibrot set

float x = z.x;
float y = z.y;

float xtemp;

int iterations = 0;

for (int i = 0; i < MAX_ITERATIONS; i++) {
    if (x*x + y*y > BAILOUT_RADIUS) {
        // Exit the loop if the escape condition is met
        break;
    }

    xtemp = pow(x * x + y * y, P / 2.0) * cos(P * atan2(y, x)) + position.x;
    y = pow(x * x + y * y, P / 2.0) * sin(P * atan2(y, x)) + position.y;
    x = xtemp; 

    z = vec2(x, y);

    // Increment the iteration count
    iterations++;
}