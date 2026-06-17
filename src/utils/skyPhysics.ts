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

// ─── 天气系统（基于大气物理光学重构）────────────────────────

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

/**
 * 米氏散射雾层混合
 * 模拟大气中气溶胶/水滴对所有波段的无选择性散射
 * 雾层颜色为高明度、极低饱和度的灰白色（符合米氏散射波长无关性）
 */
function applyMieFog(color: OklchColor, fogColor: OklchColor, intensity: number): OklchColor {
    return {
        l: lerp(color.l, fogColor.l, intensity),
        c: lerp(color.c, fogColor.c, intensity),
        h: lerpHue(color.h, fogColor.h, intensity),
    };
}

/**
 * 光谱滤除效应
 * 模拟大颗粒物（如沙尘中的铁氧化物）对短波长光的强烈散射消耗
 * 物理原理：蓝光被滤除，仅剩红橙光穿透
 */
function applySpectralFilter(color: OklchColor, filterHue: number, filterStrength: number): OklchColor {
    // 将色相强制向滤镜色相拉拽（模拟短波光被剥离后，长波光主导天空）
    const h = lerpHue(color.h, filterHue, filterStrength);
    // 饱和度向中等值靠拢（沙尘天空有明显暖色但非极度鲜艳）
    const c = lerp(color.c, 0.08, filterStrength * 0.6);
    return { l: color.l, c, h };
}

/**
 * 阴天 — 基于米氏散射的物理模型
 *
 * 物理原理：云层中液态水滴远大于可见光波长，产生波长无关的米氏散射。
 * 所有可见光被均匀打散 → 白灰色光幕。
 * 厚云层的多次散射会放大水滴对特定光谱的微弱选择性吸收 → 极微蓝偏移。
 * 
 * 天顶和地平线的差异被抹平（整片天空趋向均匀灰白）。
 */
function applyOvercast(sky: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor }) {
    // 阴天雾层：高明度、极低饱和度、微偏蓝（h≈250 符合水滴多次散射蓝偏移）
    const fogColor: OklchColor = { l: 0.58, c: 0.012, h: 250 };
    const fogIntensity = 0.7; // 厚云覆盖

    return {
        zenith:  applyMieFog(sky.zenith, fogColor, fogIntensity),
        horizon: applyMieFog(sky.horizon, { ...fogColor, l: fogColor.l + 0.05 }, fogIntensity * 0.85),
        haze:    applyMieFog(sky.haze, { ...fogColor, l: fogColor.l + 0.08 }, fogIntensity * 0.75),
    };
}

/**
 * 雷暴 — 基于超级单体光学叠加的物理模型
 * 
 * 物理原理：强对流超级单体云极厚（可达12英里），内部密集水滴和冰雹
 * 主要散射蓝光。当太阳处于低角度（黄金时刻），暖色阳光照亮蓝色云体，
 * 蓝+金黄 在人眼中叠加感知为绿色。
 * 
 * 关键点：绿色天空是太阳高度角依赖的！
 * - 太阳高角度（正午）→ 不会出现绿色，只是极暗的铅灰蓝色
 * - 太阳低角度（傍晚）→ 暖光+蓝光散射 = 诡异绿色
 * - 夜晚 → 近乎纯黑，被厚云完全遮蔽
 */
function applyThunderstorm(
    sky: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor },
    solarElevation: number
) {
    // 基础：极厚云层压暗一切，强烈去饱和
    const darkFog: OklchColor = { l: 0.22, c: 0.025, h: 260 };
    const darkIntensity = 0.75;

    const darkened = {
        zenith:  applyMieFog(sky.zenith, darkFog, darkIntensity),
        horizon: applyMieFog(sky.horizon, { ...darkFog, l: darkFog.l + 0.06 }, darkIntensity * 0.85),
        haze:    applyMieFog(sky.haze, { ...darkFog, l: darkFog.l + 0.1 }, darkIntensity * 0.7),
    };

    // 绿色偏移：仅在太阳低角度时（0°~25°之间）逐渐显现
    // 这模拟了暖色阳光照亮蓝色散射云体的光学叠加
    let greenMix = 0;
    if (solarElevation > 0 && solarElevation < 25) {
        // 在 5°~15° 之间达到最大绿色效果（黄金时刻末尾）
        greenMix = Math.sin(Math.min(solarElevation / 15, 1) * Math.PI) * 0.6;
    }

    if (greenMix > 0) {
        // 蓝光散射体 + 暖光 → 视觉感知绿色（色相约 155-170）
        const greenTint: OklchColor = { l: 0.3, c: 0.045, h: 160 };
        return {
            zenith:  applyMieFog(darkened.zenith, greenTint, greenMix * 0.5),
            horizon: applyMieFog(darkened.horizon, greenTint, greenMix * 0.8),
            haze:    applyMieFog(darkened.haze, greenTint, greenMix),
        };
    }

    return darkened;
}

/**
 * 沙尘暴 — 基于铁氧化物颗粒光谱滤除的物理模型
 *
 * 物理原理：大量富含铁氧化物的沙漠尘土悬浮在大气中，
 * 形成巨大的天然滤镜。蓝光和紫光被大颗粒的米氏散射消耗殆尽，
 * 仅剩红光和橙光能穿透尘埃层。
 * 
 * 整个天空被暖黄/橙色的浓密雾层吞噬，天顶蓝色完全消失。
 */
function applySandstorm(sky: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor }) {
    // 沙尘雾层：中低明度、中等饱和的暖黄橙色（铁氧化物反射色）
    const dustFog: OklchColor = { l: 0.42, c: 0.085, h: 60 };
    const dustIntensity = 0.8; // 极浓密的沙尘覆盖

    // 先用光谱滤镜把天顶蓝色彻底滤除
    const filtered = {
        zenith:  applySpectralFilter(sky.zenith, 55, 0.85),
        horizon: applySpectralFilter(sky.horizon, 50, 0.7),
        haze:    applySpectralFilter(sky.haze, 45, 0.6),
    };

    // 再叠加浓密的沙尘雾层
    return {
        zenith:  applyMieFog(filtered.zenith, dustFog, dustIntensity),
        horizon: applyMieFog(filtered.horizon, { ...dustFog, l: dustFog.l + 0.06 }, dustIntensity * 0.9),
        haze:    applyMieFog(filtered.haze, { ...dustFog, l: dustFog.l + 0.1 }, dustIntensity * 0.85),
    };
}

/**
 * 城市雾霾 — 基于气溶胶均匀米氏散射的物理模型
 *
 * 物理原理：大量细小的工业污染气溶胶悬浮于大气底层。
 * 米氏散射对波长不敏感 → 所有波段被均匀散射到观察者眼中 → 白灰色光幕。
 * 该光幕极大地稀释了瑞利散射产生的纯净蓝色。
 * 天空呈现灰蒙蒙的低饱和度青白色。
 * 
 * 关键：雾霾不改变色相，只是用白灰色去稀释一切。
 */
function applyHaze(sky: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor }) {
    // 雾霾层：高明度、几乎无饱和度的灰白色（纯粹的米氏均匀散射）
    const hazeFog: OklchColor = { l: 0.68, c: 0.006, h: 90 };
    const hazeIntensity = 0.6;

    return {
        // 天顶受影响最大（底层气溶胶对仰望方向的散射积分最长）
        zenith:  applyMieFog(sky.zenith, hazeFog, hazeIntensity),
        // 地平线方向本就有较多米氏散射，雾霾进一步加强
        horizon: applyMieFog(sky.horizon, { ...hazeFog, l: hazeFog.l + 0.05 }, hazeIntensity * 0.85),
        haze:    applyMieFog(sky.haze, { ...hazeFog, l: hazeFog.l + 0.08 }, hazeIntensity * 0.75),
    };
}

/**
 * 对整个天空状态应用天气修正
 * @param solarElevation 太阳高度角（度），用于雷暴的时段依赖绿色效果
 */
export function applyWeather(
    skyState: { zenith: OklchColor; horizon: OklchColor; haze: OklchColor },
    weatherType: WeatherType,
    solarElevation: number = 45
) {
    switch (weatherType) {
        case 'clear':        return skyState;
        case 'overcast':     return applyOvercast(skyState);
        case 'thunderstorm': return applyThunderstorm(skyState, solarElevation);
        case 'sandstorm':    return applySandstorm(skyState);
        case 'haze':         return applyHaze(skyState);
        default:             return skyState;
    }
}

