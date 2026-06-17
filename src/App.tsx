import { useState, useEffect, useRef } from 'react';
import { useClock } from './hooks/useClock';
import { BackgroundGradient } from './components/BackgroundGradient';
import { TimeView } from './components/TimeView';
import { DecibelView } from './components/DecibelView';
import { BottomControls } from './components/BottomControls';
import { CITIES } from './data/cities';
import { weatherPresets } from './utils/skyPhysics';
import type { WeatherType } from './utils/skyPhysics';

type ThemeMode = 'default' | 'minimal';

const WEATHER_KEYS: WeatherType[] = ['clear', 'overcast', 'thunderstorm', 'sandstorm', 'haze'];

function App() {
  const [currentCity, setCurrentCity] = useState(CITIES[4]); // Default to 成都
  const { time, totalMinutes } = useClock(currentCity.timezoneOffset);
  const [currentMode, setCurrentMode] = useState<ThemeMode>('default');
  const [currentView, setCurrentView] = useState<'time' | 'decibel'>('time');

  const [debugTime, setDebugTime] = useState<number | null>(null);
  const [debugWeather, setDebugWeather] = useState<WeatherType>('clear');
  const [animatedMinutes, setAnimatedMinutes] = useState<number>(totalMinutes);
  const isExitingDebug = useRef(false);
  const lastClickTime = useRef(0);

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
        setDebugTime(prev => prev === null ? totalMinutes : null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalMinutes]);

  const displayTime = new Date(time.getTime());
  displayTime.setHours(Math.floor(animatedMinutes / 60));
  displayTime.setMinutes(Math.floor(animatedMinutes % 60));

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'select') return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime.current;

    if (timeDiff > 0 && timeDiff < 300) {
      setDebugTime(prev => prev === null ? totalMinutes : null);
      lastClickTime.current = 0;
    } else {
      lastClickTime.current = currentTime;
    }
  };

  return (
    <div 
      className={`w-full h-full relative flex items-center justify-center overflow-hidden select-none ${currentMode}`}
      onPointerDown={handlePointerDown}
    >
      <BackgroundGradient minutes={animatedMinutes} mode={currentMode} city={currentCity} weather={debugWeather} />

      {currentView === 'time' ? (
        <TimeView minutes={animatedMinutes} time={displayTime} mode={currentMode} />
      ) : (
        <DecibelView isActive={currentView === 'decibel'} />
      )}

      <BottomControls
        currentMode={currentMode}
        onToggleMode={() => setCurrentMode(m => m === 'minimal' ? 'default' : 'minimal')}
        currentView={currentView}
        onSwitchView={setCurrentView}
        currentCity={currentCity}
        onCityChange={setCurrentCity}
      />

      {debugTime !== null && (
        <div className="debug-area">
          <div className="debug-panel">
            <label>天气</label>
            <div className="weather-btns">
              {WEATHER_KEYS.map(key => (
                <button
                  key={key}
                  className={`weather-btn ${debugWeather === key ? 'active' : ''}`}
                  onClick={() => setDebugWeather(key)}
                  title={weatherPresets[key].name}
                >
                  {weatherPresets[key].emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="debug-panel">
            <label>时间</label>
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
        </div>
      )}
    </div>
  );
}

export default App;

