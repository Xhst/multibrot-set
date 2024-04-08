
float a = float(iterations) / float(MAX_ITERATIONS);

if (a < 0.0625) {
    color = colors[0];
} else if (a < 0.125) {
    color = colors[1];
} else if (a < 0.1875) {
    color = colors[2];
} else if (a < 0.25) {
    color = colors[3];
} else if (a < 0.3125) {
    color = colors[4];
} else if (a < 0.375) {
    color = colors[5];
} else if (a < 0.4375) {
    color = colors[6];
} else if (a < 0.5) {
    color = colors[7];
} else if (a < 0.5625) {
    color = colors[8];
} else if (a < 0.625) {
    color = colors[9];
} else if (a < 0.6875) {
    color = colors[10];
} else if (a < 0.75) {
    color = colors[11];
} else if (a < 0.8125) {
    color = colors[12];
} else if (a < 0.875) {
    color = colors[13];
} else if (a < 0.9375) {
    color = colors[14];
} else {
    color = colors[15];
}