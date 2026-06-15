import { useState, useEffect } from 'react';

type ThemeMode = 'default' | 'minimal';

interface BottomControlsProps {
  currentMode: ThemeMode;
  onToggleMode: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  currentMode, onToggleMode
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);



  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };



  return (
    <div className="bottom-controls">
      <div className="controls-row">
        <button
          className="icon-btn"
          aria-label={isFullscreen ? '关闭全屏' : '打开全屏'}
          onClick={toggleFullscreen}
        >
          <span className="material-symbols-rounded">
            {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>
        <button
          className="icon-btn"
          aria-label={currentMode === 'minimal' ? '打开背景' : '关闭背景'}
          onClick={onToggleMode}
        >
          <span className="material-symbols-rounded">
            {currentMode === 'minimal' ? 'hide_image' : 'image'}
          </span>
        </button>

      </div>
    </div>
  );
};
