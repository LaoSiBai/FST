import { useState, useEffect, useRef } from 'react';
import { useClock } from './hooks/useClock';
import { BackgroundGradient } from './components/BackgroundGradient';
import { TimeView } from './components/TimeView';
import { BottomControls } from './components/BottomControls';

type ThemeMode = 'default' | 'minimal';

function App() {
  const { time, totalMinutes } = useClock();
  const [currentMode, setCurrentMode] = useState<ThemeMode>('default');

  const [debugTime, setDebugTime] = useState<number | null>(null);
  const [animatedMinutes, setAnimatedMinutes] = useState<number>(totalMinutes);
  const isExitingDebug = useRef(false);

  // Sync animatedMinutes when entering/exiting debug mode.
  useEffect(() => {
    if (debugTime !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimatedMinutes(debugTime);
      isExitingDebug.current = false;
    } else {
      isExitingDebug.current = true;
    }
  }, [debugTime]);

  // rAF-based tween from animatedMinutes → totalMinutes when exiting debug.
  useEffect(() => {
    if (!isExitingDebug.current) {
      if (debugTime === null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnimatedMinutes(totalMinutes);
      }
      return;
    }

    let animationFrameId: number;
    const animate = () => {
      setAnimatedMinutes(prev => {
        const diff = totalMinutes - prev;
        if (Math.abs(diff) < 0.5) {
          isExitingDebug.current = false;
          return totalMinutes;
        }
        return prev + diff * 0.015;
      });

      if (isExitingDebug.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalMinutes, debugTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (import.meta.env.DEV) {
          setDebugTime(prev => prev === null ? totalMinutes : null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalMinutes]);

  const displayTime = new Date(time.getTime());
  displayTime.setHours(Math.floor(animatedMinutes / 60));
  displayTime.setMinutes(Math.floor(animatedMinutes % 60));

  return (
    <div className={`w-full h-full relative flex items-center justify-center overflow-hidden ${currentMode}`}>
      <BackgroundGradient minutes={animatedMinutes} mode={currentMode} />

      <TimeView minutes={animatedMinutes} time={displayTime} mode={currentMode} />

      <BottomControls
        currentMode={currentMode}
        onToggleMode={() => setCurrentMode(m => m === 'minimal' ? 'default' : 'minimal')}
      />

      {debugTime !== null && import.meta.env.DEV && (
        <div className="debug-panel">
          <label>调试时间</label>
          <input
            type="range"
            min="0" max="1439"
            value={debugTime}
            onChange={e => setDebugTime(Number(e.target.value))}
          />
          <span className="time-display">
            {String(Math.floor(debugTime / 60)).padStart(2, '0')}:
            {String(Math.floor(debugTime % 60)).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
