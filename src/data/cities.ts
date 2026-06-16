export interface CityConfig {
    name: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number; // UTC offset in hours
}

export const CITIES: CityConfig[] = [
    { name: '北京', latitude: 39.9042, longitude: 116.4074, timezoneOffset: 8 },
    { name: '上海', latitude: 31.2304, longitude: 121.4737, timezoneOffset: 8 },
    { name: '广州', latitude: 23.1291, longitude: 113.2644, timezoneOffset: 8 },
    { name: '深圳', latitude: 22.5431, longitude: 114.0579, timezoneOffset: 8 },
    { name: '成都', latitude: 30.5728, longitude: 104.0668, timezoneOffset: 8 },
    { name: '杭州', latitude: 30.2741, longitude: 120.1551, timezoneOffset: 8 },
    { name: '武汉', latitude: 30.5928, longitude: 114.3055, timezoneOffset: 8 },
    { name: '乌鲁木齐', latitude: 43.8256, longitude: 87.6168, timezoneOffset: 8 },
    { name: '哈尔滨', latitude: 45.8038, longitude: 126.5350, timezoneOffset: 8 },
    { name: '三亚', latitude: 18.2528, longitude: 109.5120, timezoneOffset: 8 },
    { name: '雷克雅未克', latitude: 64.1466, longitude: -21.9426, timezoneOffset: 0 },
    { name: '新加坡', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8 }
];
