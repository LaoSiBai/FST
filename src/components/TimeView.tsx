import { useMemo } from 'react';
import { useQuotes } from '../hooks/useQuotes';

interface TimeViewProps {
    totalMinutes: number;
    time: Date;
    mode: string;
}

export const TimeView: React.FC<TimeViewProps> = ({ totalMinutes, time, mode }) => {
    const { current, fadeOut } = useQuotes();

    const textStyle = useMemo(() => {
        if (mode === 'minimal') return { color: '#fff', opacity: 1, shadow: 'none', fillGradient: '' };

        const hour = totalMinutes / 60;
        if (hour >= 20 && hour < 23) {
            const progress = (hour - 20) / 3;
            const glowIntensity = 0.3 + (0.8 - 0.3) * progress;
            const glowSize = Math.round(20 + (60 - 20) * progress);
            return {
                color: '#fff',
                opacity: 1,
                shadow: `0 0 ${glowSize}px rgba(255, 240, 200, ${glowIntensity.toFixed(2)}), 0 0 ${glowSize * 2}px rgba(255, 220, 150, ${(glowIntensity * 0.5).toFixed(2)})`,
                fillGradient: ''
            };
        }
        return { color: '#fff', opacity: 0.6, shadow: 'none', fillGradient: '' };
    }, [totalMinutes, mode]);

    const { countdownDays, isHidden } = useMemo(() => {
        const timeMs = time.getTime();
        const hideStart = new Date('2026-07-06T00:00:00+08:00').getTime();
        const hideEnd = new Date('2026-07-10T00:00:00+08:00').getTime();
        const target2027 = new Date('2027-06-07T00:00:00+08:00').getTime();

        if (timeMs >= hideStart && timeMs < hideEnd) {
            return { countdownDays: 0, isHidden: true };
        }

        const target = timeMs >= hideEnd ? target2027 : hideStart;
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
        backgroundImage: textStyle.fillGradient || undefined,
    } : {};

    return (
        <div className="main-container" id="timeViewContainer">
            <div className="quote-container" id="quoteContainer">
                {fadeOut && (
                    <div className="quote-text fade-out" id="quoteText1">
                        {fadeOut}
                    </div>
                )}
                <div key={current} className="quote-text active" id="quoteText2">
                    {current}
                </div>
            </div>
            
            <div className="clock-row-wrapper">
                <div className="clock" id="clock" style={clockStyle}>
                    <div className="clock-row" id="clockHours">{hoursStr}</div>
                    <span className="clock-colon">:</span>
                    <div className="clock-row" id="clockMinutes">{minutesStr}</div>
                </div>
                
                {!isHidden && (
                    <div className="countdown-container" id="countdownContainer">
                        <div className="countdown-label">考试倒计时</div>
                        <div className="countdown-timer" id="countdownTimer">
                            <span className="countdown-unit" id="cdDays">{String(countdownDays).padStart(2, '0')}</span>
                            <span className="countdown-tag">天</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
