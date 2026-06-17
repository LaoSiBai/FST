import { useMemo } from 'react';
import { interpolateSkyState, getSolarElevation, getDayOfYear, formatOklch, applyWeather } from '../utils/skyPhysics';
import type { CityConfig } from '../data/cities';
import type { WeatherType } from '../utils/skyPhysics';

interface BackgroundGradientProps {
  minutes: number;
  mode: 'default' | 'minimal';
  city: CityConfig;
  weather: WeatherType;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ minutes, mode, city, weather }) => {
  const gradientString = useMemo(() => {
    if (mode === 'minimal') return '';

    const hour = minutes / 60;
    const dayOfYear = getDayOfYear();
    const alpha = getSolarElevation(hour, city.latitude, city.longitude, dayOfYear, city.timezoneOffset);
    const baseSkyState = interpolateSkyState(alpha);

    // 叠加天气修正
    const skyState = applyWeather(baseSkyState, weather);

    const hazeColor = formatOklch(skyState.haze, 1);
    const hazeFade = formatOklch(skyState.haze, 0); 
    const horizonColor = formatOklch(skyState.horizon);
    const zenithColor = formatOklch(skyState.zenith);

    return `radial-gradient(ellipse 120% 80% at 50% 100%, ${hazeColor} 0%, ${hazeFade} 60%), linear-gradient(to bottom, ${zenithColor} 0%, ${horizonColor} 100%)`;
  }, [minutes, mode, city, weather]);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: gradientString || '#000'
      }}
    />
  );
};

