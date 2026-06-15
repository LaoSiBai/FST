import type { Color } from '../data/gradients';

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function lerpColor(c1: Color, c2: Color, t: number): Color {
    return [
        Math.round(lerp(c1[0], c2[0], t)),
        Math.round(lerp(c1[1], c2[1], t)),
        Math.round(lerp(c1[2], c2[2], t))
    ];
}
