
iterations = iterations - (iterations / 16) * 16;

// Calculate the normalized iteration count
float normalizedIterations = float(iterations) + 1.0 - (log(log(length(z)) / log(P))) / log(P);

int idx = int(normalizedIterations);
for (int i = 0; i < 16; i++) {
    if (i == idx) {
        color = mix(colors[i], colors[i + 1], fract(normalizedIterations));
        break;
    }
}