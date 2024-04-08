
precision mediump float;

const int MAX_ITERATIONS = @MAX_ITERATIONS@;
const float BAILOUT_RADIUS = @BAILOUT@;

uniform vec2 resolution;
uniform vec2 offset;

uniform float scale;

uniform vec3 colors[@COLORS_COUNT@];

@UNIFORMS@

void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    vec2 scale2 = vec2(scale, scale * resolution.y / resolution.x);

    @VARIABLES@
    
    @ITERATIONS_ALGORITHM@

    @COLORING_ALGORITHM@

    gl_FragColor = vec4(color, 1.0);
}