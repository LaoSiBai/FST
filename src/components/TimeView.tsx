import { useMemo } from 'react';
import { useQuotes } from '../hooks/useQuotes';

type ThemeMode = 'default' | 'minimal';

interface TimeViewProps {
  minutes: number;
  time: Date;
  mode: ThemeMode;
}

const EXAM_HIDE_START = new Date('2026-07-06T00:00:00+08:00').getTime();
const EXAM_HIDE_END = new Date('2026-07-10T00:00:00+08:00').getTime();
const EXAM_TARGET_2027 = new Date('2027-06-07T00:00:00+08:00').getTime();

export const TimeView: React.FC<TimeViewProps> = ({ minutes, time, mode }) => {
  const { current, fadeOut } = useQuotes();

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

  const { countdownDays, isHidden } = useMemo(() => {
    const timeMs = time.getTime();

    if (timeMs >= EXAM_HIDE_START && timeMs < EXAM_HIDE_END) {
      return { countdownDays: 0, isHidden: true };
    }

    const target = timeMs >= EXAM_HIDE_END ? EXAM_TARGET_2027 : EXAM_HIDE_START;
    const diff = target - timeMs;

    if (diff <= 0) {
      return { countdownDays: 0, isHidden: true };
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return { countdownDays: days, isHidden: false };
  }, [time]);

  const hoursStr = time.getHours().toString().padStart(2, '0');
  const minutesStr = time.getMinutes().toString().padStart(2, '0');

  const clockStyle = mode !== 'minimal' ? {
    color: textStyle.color,
    opacity: textStyle.opacity,
    textShadow: textStyle.shadow,
  } : {};

  return (
    <div className="main-container">
      <div className="quote-container">
        {fadeOut && (
          <div className="quote-text fade-out">
            {fadeOut}
          </div>
        )}
        <div key={current} className="quote-text active">
          {current}
        </div>
      </div>

      <div className="clock-row-wrapper">
        <div className="clock" style={clockStyle}>
          <div className="clock-row">{hoursStr}</div>
          <span className="clock-colon">:</span>
          <div className="clock-row">{minutesStr}</div>
        </div>

        {!isHidden && (
          <div className="countdown-container">
            <div className="countdown-label">考试倒计时</div>
            <div className="countdown-timer">
              <span className="countdown-unit">{String(countdownDays).padStart(2, '0')}</span>
              <span className="countdown-tag">天</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
