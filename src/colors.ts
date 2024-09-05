export class Color {
    public r: number;
    public g: number;
    public b: number;

    private constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Creates a color from a hex string.
     * @param hex - The hex string.
     * @returns The color.
    */
    public static fromHex(hex: string): Color {
        const hexValue = hex.replace("#", "");
        return new Color(
            parseInt(hexValue.substring(0, 2), 16) / 255,
            parseInt(hexValue.substring(2, 4), 16) / 255,
            parseInt(hexValue.substring(4, 6), 16) / 255,
        );
    }

    /**
     * Creates a color from RGB values.
     * @param r - The red value.
     * @param g - The green value.
     * @param b - The blue value.
     * @returns The color.
     */
    public static fromRGB(r: number, g: number, b: number): Color {
        return new Color(r / 255, g / 255, b / 255);
    }

    /**
     * Creates a color from percentage RGB values.
     * @param r - The red value.
     * @param g - The green value.
     * @param b - The blue value.
     * @returns The color.
     */
    public static fromPercentage(r: number, g: number, b: number): Color {
        return new Color(r, g, b);
    }

    /**
     * Returns the color as a hex string.
     * @returns The hex string.
     */
    public getHex(): string {
        return "#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
    }

    /**
     * Returns the color component as an hex string.
     * @returns The hex string for the component.
     */
    private componentToHex(c: number): string {
        const hex = (c * 255).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    public static BLACK: Color = Color.fromRGB(0, 0, 0);
}

export const basePalette: Color[] = [
    Color.fromRGB(9, 1, 47),
    Color.fromRGB(4, 4, 73),
    Color.fromRGB(0, 7, 100),
    Color.fromRGB(12, 44, 138),
    Color.fromRGB(24, 82, 177),
    Color.fromRGB(57, 125, 209),
    Color.fromRGB(134, 181, 229),
    Color.fromRGB(211, 236, 248),
    Color.fromRGB(241, 233, 191),
    Color.fromRGB(248, 201, 95),
    Color.fromRGB(255, 170, 0),
    Color.fromRGB(204, 128, 0),
    Color.fromRGB(153, 87, 0),
    Color.fromRGB(106, 52, 3),
    Color.fromRGB(66, 30, 15),
    Color.fromRGB(25, 7, 26),
];

export function getRandomColor(): Color {
    return Color.fromRGB(Math.random(), Math.random(), Math.random());
}

export function getLinearPalette(color1: Color, color2: Color, steps: number): Array<Color> {
    const palette: Array<Color> = [];
    for (let i = 0; i < steps; i++) {
        const t = i / steps;
        palette.push(interpolateColors(color1, color2, t));
    }
    return palette;
}

export function interpolateColors(color1: Color, color2: Color, t: number): Color {
    return Color.fromRGB(
        color1.r + (color2.r - color1.r) * t,
        color1.g + (color2.g - color1.g) * t,
        color1.b + (color2.b - color1.b) * t,
    );
}