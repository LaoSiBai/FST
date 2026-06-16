import { useMemo } from 'react';
import { interpolateSkyState, getSolarElevation, getDayOfYear, formatOklch } from '../utils/skyPhysics';
import type { CityConfig } from '../data/cities';

interface BackgroundGradientProps {
  minutes: number;
  mode: 'default' | 'minimal';
  city: CityConfig;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ minutes, mode, city }) => {
  const gradientString = useMemo(() => {
    if (mode === 'minimal') return '';

    const hour = minutes / 60;
    const dayOfYear = getDayOfYear();
    const alpha = getSolarElevation(hour, city.latitude, city.longitude, dayOfYear, city.timezoneOffset);
    const skyState = interpolateSkyState(alpha);

    const hazeColor = formatOklch(skyState.haze, 1);
    const hazeFade = formatOklch(skyState.haze, 0); 
    const horizonColor = formatOklch(skyState.horizon);
    const zenithColor = formatOklch(skyState.zenith);

    return `radial-gradient(ellipse 120% 80% at 50% 100%, ${hazeColor} 0%, ${hazeFade} 60%), linear-gradient(to bottom, ${zenithColor} 0%, ${horizonColor} 100%)`;
  }, [minutes, mode, city]);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: gradientString || '#000'
      }}
    />
  );
};
