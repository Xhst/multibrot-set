// Define the attribute for the position of the vertex
attribute vec2 position;

void main() {
    // Set the position of the vertex in clip space
    gl_Position = vec4(position, 0, 1);
}