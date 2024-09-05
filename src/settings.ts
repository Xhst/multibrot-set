import grayscaleColoring from './shaders/coloring/grayscale.glsl';
import discreteColoring from './shaders/coloring/discrete.glsl';
import linearColoring from './shaders/coloring/linear.glsl';
import normalizedIterationCountColoring from './shaders/coloring/normalized_iteration_count.glsl';
import { Color } from './colors';

/*
* Represents the settings used for the fractal visualization.
* The settings are read from the HTML elements.
*/
export abstract class Settings {


    /**
     * Gets the exponent used for the fractal calculation.
     * @returns The exponent.
     */
    public static getExponent(): number {
        return parseFloat((document.getElementById('exponent') as HTMLInputElement).value);
    }

    /**
     * Gets the maximum iterations for the fractal calculation.
     * @returns The maximum iterations.
     */
    public static getMaxIterations(): number {
        return parseInt((document.getElementById('max-iterations') as HTMLInputElement).value);
    }

    /**
     * Gets the bail-out value for the fractal calculation.
     * @returns The bail-out value.
     */
    public static getBailOut(): number {
        return parseFloat((document.getElementById('bail-out') as HTMLInputElement).value);
    }

    /**
     * Gets the coloring algorithm for the fractal visualization.
     * @returns The coloring algorithm.
     */
    public static getColoringAlgorithm(): string {
        const algorithmValue: string = (document.getElementById('color-alg') as HTMLSelectElement).value;

        let algorithm: string;
        switch (algorithmValue) {
            default:
            case "0":
                algorithm = grayscaleColoring;
                break;
            case"1":
                algorithm = discreteColoring;
                break;
            case "2":
                algorithm = linearColoring;
                break;
            case "3":
                algorithm = normalizedIterationCountColoring;
                break;
        }

        return algorithm;
    }

    /**
     * Gets the seed for the Julia set.
     * The seed is defined by the x and y coordinates in complex plane of the Mandelbrot set.
     * @returns The Julia seed.
     */
    public static getJuliaSeed(): {x: number, y: number} {
        return {
            x: parseFloat((document.getElementById('julia-x') as HTMLInputElement).value),
            y: parseFloat((document.getElementById('julia-y') as HTMLInputElement).value)
        };
    } 

    /**
     * Updates the Julia seed in the HTML elements.
     * @param seed - The new seed for the Julia set. 
     */
    public static updateJuliaSeed(seed: {x: number, y: number}): void {
        (document.getElementById('julia-x') as HTMLInputElement).value = seed.x.toString();
        (document.getElementById('julia-y') as HTMLInputElement).value = seed.y.toString();
    }

    /**
     * Toggles the side-by-side visualization.
     */
    public static toggleSideBySide(): void {
        let canvasContainer = document.getElementById('canvas-container');
        let sideBySide = (document.getElementById('side-by-side') as HTMLInputElement).checked;

        if (sideBySide) {
            canvasContainer.classList.remove('flex-column');
        } else {
            canvasContainer.classList.add('flex-column');
        }
    }

    public static loadColorPalette(palette: Color[]): void {
        for (let i = 0; i < palette.length; i++) {
            let color = palette[i];
            let colorInput = document.getElementById(`color-${i}`) as HTMLInputElement;
            colorInput.value = color.getHex();
        }
    }

    public static getColorPalette(): Color[] {
        let palette: Color[] = [];
        for (let i = 0; i < 16; i++) {
            let colorInput = document.getElementById(`color-${i}`) as HTMLInputElement;
            palette.push(Color.fromHex(colorInput.value));
        }
        return palette;
    }
}