import { useState, useEffect, useRef } from 'react';
import { useClock } from './hooks/useClock';
import { BackgroundGradient } from './components/BackgroundGradient';
import { TimeView } from './components/TimeView';
import { DecibelView } from './components/DecibelView';
import { BottomControls } from './components/BottomControls';

function App() {
    const { time, totalMinutes } = useClock();
    const [currentMode, setCurrentMode] = useState<string>('default');
    const [currentView, setCurrentView] = useState<'time' | 'decibel'>('time');

    // Debug Mode Calibration hook could be added here if needed, 
    // but we can omit it for brevity or implement a simple version
    const [debugTime, setDebugTime] = useState<number | null>(null);
    const [animatedMinutes, setAnimatedMinutes] = useState<number>(totalMinutes);
    const isExitingDebug = useRef(false);

    useEffect(() => {
        if (debugTime !== null) {
            setAnimatedMinutes(debugTime);
            isExitingDebug.current = false;
        } else {
            // When debugTime is null, we need to tween back to totalMinutes
            isExitingDebug.current = true;
        }
    }, [debugTime]);

    useEffect(() => {
        if (!isExitingDebug.current) {
            if (debugTime === null) {
                setAnimatedMinutes(totalMinutes);
            }
            return;
        }

        let animationFrameId: number;
        const animate = () => {
            setAnimatedMinutes(prev => {
                const diff = totalMinutes - prev;
                // If we are close enough, snap to target and stop animating
                if (Math.abs(diff) < 0.5) {
                    isExitingDebug.current = false;
                    return totalMinutes;
                }
                // Ease towards totalMinutes. This linear approach directly goes from prev to totalMinutes
                // Ease towards totalMinutes. Slower transition speed for better visual effect.
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
                if (debugTime === null) {
                    setDebugTime(totalMinutes);
                } else {
                    setDebugTime(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [debugTime, totalMinutes]);

    const displayTime = new Date(time.getTime());
    displayTime.setHours(Math.floor(animatedMinutes / 60));
    displayTime.setMinutes(Math.floor(animatedMinutes % 60));

    return (
        <div className={`w-full h-full relative flex items-center justify-center overflow-hidden ${currentMode}`}>
            <BackgroundGradient totalMinutes={animatedMinutes} mode={currentMode} />

            {currentView === 'time' ? (
                <TimeView totalMinutes={animatedMinutes} time={displayTime} mode={currentMode} />
            ) : (
                <DecibelView isActive={currentView === 'decibel'} />
            )}

            <BottomControls 
                currentMode={currentMode}
                onToggleMode={() => setCurrentMode(m => m === 'minimal' ? 'default' : 'minimal')}
                currentView={currentView}
                onSwitchView={setCurrentView}
            />

            {debugTime !== null && (
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
