
float a = float(iterations) / float(MAX_ITERATIONS);

if (a < 0.0625) {
    color = mix(colors[0], colors[1], a);
} else if (a < 0.125) {
    color = mix(colors[1], colors[2], a);
} else if (a < 0.1875) {
    color = mix(colors[2], colors[3], a);
} else if (a < 0.25) {
    color = mix(colors[3], colors[4], a);
} else if (a < 0.3125) {
    color = mix(colors[4], colors[5], a);
} else if (a < 0.375) {
    color = mix(colors[5], colors[6], a);
} else if (a < 0.4375) {
    color = mix(colors[6], colors[7], a);
} else if (a < 0.5) {
    color = mix(colors[7], colors[8], a);
} else if (a < 0.5625) {
    color = mix(colors[8], colors[9], a);
} else if (a < 0.625) {
    color = mix(colors[9], colors[10], a);
} else if (a < 0.6875) {
    color = mix(colors[10], colors[11], a);
} else if (a < 0.75) {
    color = mix(colors[11], colors[12], a);
} else if (a < 0.8125) {
    color = mix(colors[12], colors[13], a);
} else if (a < 0.875) {
    color = mix(colors[13], colors[14], a);
} else {
    color = mix(colors[14], colors[15], a);
}