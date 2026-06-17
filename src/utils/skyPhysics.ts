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

/** 通用天空关键帧插值（可用于任意一组 stops） */
function interpolateStops(
    stops: Array<{ alpha: number; zenith: OklchColor; horizon: OklchColor; haze: OklchColor }>,
    alpha: number
) {
    if (alpha <= stops[0].alpha) return stops[0];
    if (alpha >= stops[stops.length - 1].alpha) return stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
        const start = stops[i];
        const end = stops[i + 1];
        if (alpha >= start.alpha && alpha <= end.alpha) {
            let t = (alpha - start.alpha) / (end.alpha - start.alpha);
            t = t * t * (3 - 2 * t);
            return {
                zenith: lerpOklch(start.zenith, end.zenith, t),
                horizon: lerpOklch(start.horizon, end.horizon, t),
                haze: lerpOklch(start.haze, end.haze, t)
            };
        }
    }
    return stops[0];
}

export function interpolateSkyState(alpha: number) {
    return interpolateStops(skyStops, alpha);
}

// ─── 天气独立天空关键帧 ─────────────────────────────────

/**
 * 阴天 — 米氏散射将所有波段均匀打散 → 灰白色天穹
 * 厚云层多次散射产生微弱蓝偏移，日落暖色被大幅过滤
 */
const overcastStops = [
    { alpha: -18, zenith: { l: 0.08, c: 0.005, h: 255 }, horizon: { l: 0.12, c: 0.008, h: 255 }, haze: { l: 0.1, c: 0.005, h: 255 } },
    { alpha: -9,  zenith: { l: 0.2, c: 0.02, h: 260 },  horizon: { l: 0.25, c: 0.025, h: 258 }, haze: { l: 0.28, c: 0.02, h: 255 } },
    { alpha: -2.5, zenith: { l: 0.32, c: 0.02, h: 260 }, horizon: { l: 0.38, c: 0.03, h: 20 },   haze: { l: 0.4, c: 0.025, h: 30 } },
    { alpha: 0,   zenith: { l: 0.38, c: 0.02, h: 265 },  horizon: { l: 0.45, c: 0.04, h: 25 },   haze: { l: 0.5, c: 0.035, h: 30 } },
    { alpha: 10,  zenith: { l: 0.5, c: 0.015, h: 255 },  horizon: { l: 0.55, c: 0.02, h: 240 },  haze: { l: 0.58, c: 0.015, h: 230 } },
    { alpha: 45,  zenith: { l: 0.55, c: 0.012, h: 250 }, horizon: { l: 0.6, c: 0.01, h: 245 },   haze: { l: 0.62, c: 0.008, h: 240 } },
];

/**
 * 雷暴 — 超级单体风暴，极厚云层
 * 正午为铅灰蓝色，傍晚暖光+蓝光散射云体 → 诡异蓝绿色
 */
const thunderstormStops = [
    { alpha: -18, zenith: { l: 0.03, c: 0.003, h: 260 }, horizon: { l: 0.05, c: 0.005, h: 260 }, haze: { l: 0.04, c: 0.003, h: 260 } },
    { alpha: -9,  zenith: { l: 0.1, c: 0.015, h: 265 },  horizon: { l: 0.13, c: 0.02, h: 260 },  haze: { l: 0.15, c: 0.015, h: 258 } },
    { alpha: -2.5, zenith: { l: 0.15, c: 0.02, h: 270 }, horizon: { l: 0.2, c: 0.03, h: 200 },   haze: { l: 0.22, c: 0.025, h: 190 } },
    { alpha: 0,   zenith: { l: 0.2, c: 0.025, h: 220 },  horizon: { l: 0.25, c: 0.04, h: 160 },  haze: { l: 0.28, c: 0.045, h: 155 } },
    { alpha: 10,  zenith: { l: 0.22, c: 0.03, h: 190 },  horizon: { l: 0.28, c: 0.05, h: 155 },  haze: { l: 0.3, c: 0.055, h: 150 } },
    { alpha: 45,  zenith: { l: 0.25, c: 0.02, h: 255 },  horizon: { l: 0.3, c: 0.015, h: 250 },  haze: { l: 0.32, c: 0.012, h: 245 } },
];

/**
 * 沙尘暴 — 铁氧化物颗粒完全滤除蓝光
 * 全天候暗黄/橙色，日落时偏向血红
 */
const sandstormStops = [
    { alpha: -18, zenith: { l: 0.08, c: 0.02, h: 50 },  horizon: { l: 0.1, c: 0.03, h: 45 },   haze: { l: 0.09, c: 0.025, h: 45 } },
    { alpha: -9,  zenith: { l: 0.18, c: 0.04, h: 50 },  horizon: { l: 0.22, c: 0.06, h: 45 },  haze: { l: 0.25, c: 0.055, h: 42 } },
    { alpha: -2.5, zenith: { l: 0.25, c: 0.06, h: 45 }, horizon: { l: 0.3, c: 0.09, h: 35 },   haze: { l: 0.32, c: 0.1, h: 30 } },
    { alpha: 0,   zenith: { l: 0.3, c: 0.08, h: 40 },   horizon: { l: 0.38, c: 0.12, h: 25 },  haze: { l: 0.42, c: 0.13, h: 20 } },
    { alpha: 10,  zenith: { l: 0.38, c: 0.08, h: 55 },  horizon: { l: 0.42, c: 0.09, h: 50 },  haze: { l: 0.48, c: 0.1, h: 48 } },
    { alpha: 45,  zenith: { l: 0.42, c: 0.085, h: 60 }, horizon: { l: 0.48, c: 0.08, h: 55 },  haze: { l: 0.52, c: 0.075, h: 52 } },
];

/**
 * 城市雾霾 — 气溶胶均匀米氏散射稀释一切颜色
 * 灰蒙蒙低饱和度，日落暖色被削弱但仍可辨认
 */
const hazeStops = [
    { alpha: -18, zenith: { l: 0.06, c: 0.004, h: 260 }, horizon: { l: 0.1, c: 0.008, h: 260 },  haze: { l: 0.09, c: 0.005, h: 260 } },
    { alpha: -9,  zenith: { l: 0.2, c: 0.025, h: 270 },  horizon: { l: 0.28, c: 0.03, h: 265 },  haze: { l: 0.32, c: 0.025, h: 260 } },
    { alpha: -2.5, zenith: { l: 0.32, c: 0.03, h: 270 }, horizon: { l: 0.4, c: 0.05, h: 20 },    haze: { l: 0.45, c: 0.045, h: 30 } },
    { alpha: 0,   zenith: { l: 0.4, c: 0.035, h: 265 },  horizon: { l: 0.5, c: 0.06, h: 35 },    haze: { l: 0.55, c: 0.055, h: 40 } },
    { alpha: 10,  zenith: { l: 0.55, c: 0.03, h: 250 },  horizon: { l: 0.62, c: 0.035, h: 100 }, haze: { l: 0.68, c: 0.025, h: 90 } },
    { alpha: 45,  zenith: { l: 0.62, c: 0.025, h: 245 }, horizon: { l: 0.7, c: 0.015, h: 210 },  haze: { l: 0.73, c: 0.008, h: 90 } },
];

// ─── 天气系统 ────────────────────────────────────────────

export type WeatherType = 'clear' | 'overcast' | 'thunderstorm' | 'sandstorm' | 'haze';

export interface WeatherPreset {
    name: string;
    emoji: string;
}

export const weatherPresets: Record<WeatherType, WeatherPreset> = {
    clear:        { name: '晴天', emoji: '☀️' },
    overcast:     { name: '阴天', emoji: '☁️' },
    thunderstorm: { name: '雷暴', emoji: '⛈️' },
    sandstorm:    { name: '沙尘', emoji: '🏜️' },
    haze:         { name: '雾霾', emoji: '🌫️' },
};

/** 根据天气类型获取对应的独立 skyStops */
function getWeatherStops(weatherType: WeatherType) {
    switch (weatherType) {
        case 'overcast':     return overcastStops;
        case 'thunderstorm': return thunderstormStops;
        case 'sandstorm':    return sandstormStops;
        case 'haze':         return hazeStops;
        default:             return skyStops;
    }
}

/**
 * 根据天气类型和太阳高度角，直接插值出天空颜色
 * 每种天气拥有完全独立的关键帧，不依赖晴天颜色
 */
export function applyWeather(
    _skyState: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor },
    weatherType: WeatherType,
    solarElevation: number = 45
) {
    if (weatherType === 'clear') return _skyState;
    return interpolateStops(getWeatherStops(weatherType), solarElevation);
}
