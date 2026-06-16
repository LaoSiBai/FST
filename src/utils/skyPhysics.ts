export interface OklchColor {
    l: number;
    c: number;
    h: number;
}

export const skyStops = [
    {
        name: '彻底黑夜',
        alpha: -18,
        zenith: { l: 0.05, c: 0.005, h: 260 },
        horizon: { l: 0.1, c: 0.01, h: 260 },
        haze: { l: 0.08, c: 0.005, h: 260 }
    },
    {
        name: '航海暮光',
        alpha: -9,
        zenith: { l: 0.2, c: 0.05, h: 275 },
        horizon: { l: 0.3, c: 0.06, h: 265 },
        haze: { l: 0.35, c: 0.06, h: 260 }
    },
    {
        name: '民用暮光',
        alpha: -2.5,
        zenith: { l: 0.3, c: 0.07, h: 280 },
        horizon: { l: 0.45, c: 0.1, h: 15 },
        haze: { l: 0.5, c: 0.1, h: 30 }
    },
    {
        name: '物理日落',
        alpha: 0,
        zenith: { l: 0.4, c: 0.1, h: 270 },
        horizon: { l: 0.6, c: 0.14, h: 35 },
        haze: { l: 0.75, c: 0.16, h: 45 }
    },
    {
        name: '黄金时刻',
        alpha: 10,
        zenith: { l: 0.65, c: 0.11, h: 260 },
        horizon: { l: 0.8, c: 0.08, h: 70 },
        haze: { l: 0.9, c: 0.12, h: 60 }
    },
    {
        name: '正午白昼',
        alpha: 45,
        zenith: { l: 0.7, c: 0.09, h: 250 },
        horizon: { l: 0.85, c: 0.03, h: 210 },
        haze: { l: 0.9, c: 0.01, h: 90 }
    }
];

export function getSolarElevation(hour: number, latitude: number, longitude: number, dayOfYear: number, timezoneOffset: number): number {
    const B = (360 / 365) * (dayOfYear - 81);
    const declination = 23.45 * Math.sin((B * Math.PI) / 180);
    
    const radB = (B * Math.PI) / 180;
    const EoT = 9.87 * Math.sin(2 * radB) - 7.53 * Math.cos(radB) - 1.5 * Math.sin(radB);
    
    // Compute Local Standard Time Meridian based on the city's timezone offset
    const LSTM = timezoneOffset * 15;
    
    const TC = 4 * (longitude - LSTM) + EoT;
    const LST = hour + TC / 60;
    const HRA = 15 * (LST - 12);
    
    const radDec = (declination * Math.PI) / 180;
    const radLat = (latitude * Math.PI) / 180;
    const radHRA = (HRA * Math.PI) / 180;
    
    let sinAlpha = Math.sin(radDec) * Math.sin(radLat) + Math.cos(radDec) * Math.cos(radLat) * Math.cos(radHRA);
    if (sinAlpha > 1) sinAlpha = 1;
    if (sinAlpha < -1) sinAlpha = -1;
    
    return (Math.asin(sinAlpha) * 180) / Math.PI;
}

export function getDayOfYear(date: Date = new Date()): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function lerpHue(a: number, b: number, t: number): number {
    let diff = b - a;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return a + diff * t;
}

export function lerpOklch(c1: OklchColor, c2: OklchColor, t: number): OklchColor {
    return {
        l: lerp(c1.l, c2.l, t),
        c: lerp(c1.c, c2.c, t),
        h: lerpHue(c1.h, c2.h, t)
    };
}

export function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const sRGB = (c: number) => {
        if (c <= 0) return 0;
        if (c <= 0.0031308) return 12.92 * c;
        return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    return [
        Math.max(0, Math.min(255, Math.round(sRGB(r) * 255))),
        Math.max(0, Math.min(255, Math.round(sRGB(g) * 255))),
        Math.max(0, Math.min(255, Math.round(sRGB(b_) * 255)))
    ];
}

export function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
    const hRad = h * Math.PI / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    return oklabToRgb(l, a, b);
}

export function formatOklch(color: OklchColor, alpha: number = 1): string {
    const [r, g, b] = oklchToRgb(color.l, color.c, color.h);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function interpolateSkyState(alpha: number) {
    if (alpha <= skyStops[0].alpha) return skyStops[0];
    if (alpha >= skyStops[skyStops.length - 1].alpha) return skyStops[skyStops.length - 1];
    
    for (let i = 0; i < skyStops.length - 1; i++) {
        const start = skyStops[i];
        const end = skyStops[i + 1];
        if (alpha >= start.alpha && alpha <= end.alpha) {
            let t = (alpha - start.alpha) / (end.alpha - start.alpha);
            // Ease-in-out curve for smoother transition
            t = t * t * (3 - 2 * t);
            return {
                zenith: lerpOklch(start.zenith, end.zenith, t),
                horizon: lerpOklch(start.horizon, end.horizon, t),
                haze: lerpOklch(start.haze, end.haze, t)
            };
        }
    }
    return skyStops[0];
}
