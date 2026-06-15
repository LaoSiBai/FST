import { useEffect, useMemo } from 'react';
import { timeStops } from '../data/gradients';
import { lerp, lerpColor } from '../utils/color';
import { easingMap } from '../utils/easing';

type ThemeMode = 'default' | 'minimal';

interface BackgroundGradientProps {
  minutes: number;
  mode: ThemeMode;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ minutes, mode }) => {
  const gradientString = useMemo(() => {
    if (mode === 'minimal') return '';

    const hour = minutes / 60;
    let i = 0;
    for (; i < timeStops.length - 1; i++) {
      if (hour >= timeStops[i].hour && hour < timeStops[i + 1].hour) {
        break;
      }
    }

    const start = timeStops[i];
    const end = timeStops[(i + 1) % timeStops.length];
    const duration = (end.hour > start.hour)
      ? (end.hour - start.hour)
      : (24 - start.hour + end.hour);
    const rawProgress = (hour - start.hour) / duration;

    const easingFn = easingMap[start.easing] || easingMap.easeInOutCubic;
    const progress = easingFn(rawProgress);

    const maxStops = Math.max(start.stops.length, end.stops.length);
    const interpolatedStops = [];

    for (let s = 0; s < maxStops; s++) {
      const s1 = start.stops[Math.min(s, start.stops.length - 1)];
      const s2 = end.stops[Math.min(s, end.stops.length - 1)];

      interpolatedStops.push({
        pos: lerp(s1.pos, s2.pos, progress),
        color: lerpColor(s1.color, s2.color, progress)
      });
    }

    const isMobile = window.innerWidth <= 768;
    const compressedStops = interpolatedStops.map(s =>
      `rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]}) ${(s.pos * 0.8).toFixed(2)}%`
    ).join(', ');

    const centerY = isMobile ? '-20%' : '-60%';
    return `radial-gradient(circle 180vmax at 50% ${centerY}, ${compressedStops})`;
  }, [minutes, mode]);

  useEffect(() => {
    if (mode === 'default') {
      document.body.style.background = gradientString;
    } else {
      document.body.style.background = '#000';
    }
  }, [gradientString, mode]);

  return null;
};
