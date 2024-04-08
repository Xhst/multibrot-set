
vec2 position = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y * scale2 + offset;
vec2 z = vec2(0.0, 0.0);

int iterations = 0;