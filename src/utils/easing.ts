export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
    return t * t * t;
}

export const easingMap: Record<string, (t: number) => number> = {
    easeInOutCubic,
    easeInOutQuad,
    easeOutCubic,
    easeInCubic
};
