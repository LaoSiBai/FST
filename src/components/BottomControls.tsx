import { useState, useRef, useEffect } from 'react';
import {
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiPaletteLine,
  RiMoonClearLine,
  RiMore2Line
} from '@remixicon/react';

type ThemeMode = 'default' | 'minimal';
type ViewMode = 'time' | 'decibel';

interface BottomControlsProps {
  currentMode: ThemeMode;
  onToggleMode: () => void;
  currentView: ViewMode;
  onSwitchView: (view: ViewMode) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  currentMode, onToggleMode, currentView, onSwitchView
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreContainerRef.current && !moreContainerRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleViewSwitch = (view: ViewMode) => {
    onSwitchView(view);
    setIsMoreOpen(false);
  };

  return (
    <div className="bottom-controls">
      <div className="controls-row">
        <button
          className="icon-btn"
          aria-label={isFullscreen ? '关闭全屏' : '打开全屏'}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <RiFullscreenExitLine size={24} /> : <RiFullscreenLine size={24} />}
        </button>
        <button
          className="icon-btn"
          aria-label={currentMode === 'minimal' ? '打开背景' : '关闭背景'}
          onClick={onToggleMode}
        >
          {currentMode === 'minimal' ? <RiMoonClearLine size={24} /> : <RiPaletteLine size={24} />}
        </button>
        <div
          className={`more-container ${isMoreOpen ? 'open' : ''}`}
          ref={moreContainerRef}
        >
          <button
            className="icon-btn"
            id="moreBtn"
            aria-label="更多选项"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
          >
            <RiMore2Line size={24} />
          </button>
          <div className="morph-panel">
            <div
              className={`morph-item ${currentView === 'time' ? 'active' : ''}`}
              onClick={() => handleViewSwitch('time')}
            >
              显示时间
            </div>
            <div
              className={`morph-item ${currentView === 'decibel' ? 'active' : ''}`}
              onClick={() => handleViewSwitch('decibel')}
            >
              分贝仪
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
