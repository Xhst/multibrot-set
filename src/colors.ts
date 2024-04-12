export type Color = {
    r: number;
    g: number;
    b: number;
};

export const basePalette: Array<Color> = [
    {r: 9/255, g: 1/255, b: 47/255},
    {r: 4/255, g: 4/255, b: 73/255},
    {r: 0/255, g: 7/255, b: 100/255},
    {r: 12/255, g: 44/255, b: 138/255},
    {r: 24/255, g: 82/255, b: 177/255},
    {r: 57/255, g: 125/255, b: 209/255},
    {r: 134/255, g: 181/255, b: 229/255},
    {r: 211/255, g: 236/255, b: 248/255},
    {r: 241/255, g: 233/255, b: 191/255},
    {r: 248/255, g: 201/255, b: 95/255},
    {r: 255/255, g: 170/255, b: 0/255},
    {r: 204/255, g: 128/255, b: 0/255},
    {r: 153/255, g: 87/255, b: 0/255},
    {r: 106/255, g: 52/255, b: 3/255},
    {r: 66/255, g: 30/255, b: 15/255},
    {r: 25/255, g: 7/255, b: 26/255},
];

export function getRandomColor(): Color {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
    };
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
    return {
        r: color1.r + (color2.r - color1.r) * t,
        g: color1.g + (color2.g - color1.g) * t,
        b: color1.b + (color2.b - color1.b) * t,
    };
}