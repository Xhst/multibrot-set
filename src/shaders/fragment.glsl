const int MAX_ITERATIONS = @MAX_ITERATIONS@;

precision mediump float;

uniform vec2 resolution;
uniform float scale;
uniform vec2 center;

void main() {
    vec2 position = (gl_FragCoord.xy - resolution / 2.0) / scale + center;
    vec2 z = vec2(0.0, 0.0);
    int iterations = 0;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        if (length(z) > 2.0) {
            break;
        }
            
        vec2 newZ = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + position;
        z = newZ;
        iterations++;
    }
    
    float color = float(iterations) / float(MAX_ITERATIONS);
    gl_FragColor = vec4(color, color, color, 1.0);
}