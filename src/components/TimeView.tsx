import { useMemo } from 'react';

type ThemeMode = 'default' | 'minimal';

interface TimeViewProps {
  minutes: number;
  time: Date;
  mode: ThemeMode;
}

export const TimeView: React.FC<TimeViewProps> = ({ minutes, time, mode }) => {

  const textStyle = useMemo(() => {
    if (mode === 'minimal') return { color: '#fff', opacity: 1, shadow: 'none' };

    const hour = minutes / 60;
    if (hour >= 20 && hour < 23) {
      const progress = (hour - 20) / 3;
      const glowIntensity = 0.3 + (0.8 - 0.3) * progress;
      const glowSize = Math.round(20 + (60 - 20) * progress);
      return {
        color: '#fff',
        opacity: 1,
        shadow: `0 0 ${glowSize}px rgba(255, 240, 200, ${glowIntensity.toFixed(2)}), 0 0 ${glowSize * 2}px rgba(255, 220, 150, ${(glowIntensity * 0.5).toFixed(2)})`
      };
    }
    return { color: '#fff', opacity: 0.6, shadow: 'none' };
  }, [minutes, mode]);

  const hoursStr = time.getHours().toString().padStart(2, '0');
  const minutesStr = time.getMinutes().toString().padStart(2, '0');

  const clockStyle = mode !== 'minimal' ? {
    color: textStyle.color,
    opacity: textStyle.opacity,
    textShadow: textStyle.shadow,
  } : {};

  return (
    <div className="main-container">
      <div className="clock-row-wrapper">
        <div className="clock" style={clockStyle}>
          <div className="clock-row">{hoursStr}</div>
          <span className="clock-colon">:</span>
          <div className="clock-row">{minutesStr}</div>
        </div>
      </div>
    </div>
  );
};
