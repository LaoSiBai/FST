import { useState, useRef, useEffect } from 'react';
import {
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiPaletteLine,
  RiMoonClearLine,
  RiMore2Line
} from '@remixicon/react';
import { CITIES } from '../data/cities';
import type { CityConfig } from '../data/cities';
import { useSpring } from '../hooks/useSpring';

type ThemeMode = 'default' | 'minimal';
type ViewMode = 'time' | 'decibel';

interface BottomControlsProps {
  currentMode: ThemeMode;
  onToggleMode: () => void;
  currentView: ViewMode;
  onSwitchView: (view: ViewMode) => void;
  currentCity: CityConfig;
  onCityChange: (city: CityConfig) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  currentMode, onToggleMode, currentView, onSwitchView, currentCity, onCityChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const moreContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | PointerEvent | TouchEvent) => {
      if (!document.contains(e.target as Node)) return;
      
      if (moreContainerRef.current && !moreContainerRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
        setTimeout(() => setIsCityMenuOpen(false), 300);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleMoreClick = () => {
    if (isMoreOpen) {
      setIsMoreOpen(false);
      setTimeout(() => setIsCityMenuOpen(false), 300);
    } else {
      setIsMoreOpen(true);
    }
  };

  const handleViewSwitch = (view: ViewMode) => {
    onSwitchView(view);
    setIsMoreOpen(false);
    setTimeout(() => setIsCityMenuOpen(false), 300);
  };

  const handleCitySelect = (city: CityConfig) => {
    onCityChange(city);
    setIsMoreOpen(false);
    setTimeout(() => setIsCityMenuOpen(false), 300);
  };

  // 真正的定制物理引擎驱动
  const targetWidth = isMoreOpen ? (isCityMenuOpen ? 160 : 140) : 40;
  const targetHeight = isMoreOpen ? (isCityMenuOpen ? 368 : 168) : 40;
  // 内部元素高度约为 44px (完美胶囊 R=22)。为了保持同心，外部 R = 22 + 12(padding) = 34
  const targetRadius = isMoreOpen ? 34 : 20;

  // 物理弹簧参数：调整刚度和阻尼，让回弹不至于"压扁"（避免过度阻尼/震荡太剧烈）
  const springConfig = { stiffness: 350, damping: 22 };
  
  const animatedWidth = useSpring(targetWidth, springConfig);
  const animatedHeight = useSpring(targetHeight, springConfig);
  const animatedRadius = useSpring(targetRadius, springConfig);

  return (
    <div className="bottom-controls" onPointerDown={(e) => e.stopPropagation()}>
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
          className={`more-container ${isMoreOpen ? 'open' : ''} ${isCityMenuOpen ? 'show-cities' : ''}`}
          ref={moreContainerRef}
        >
          <button
            className="icon-btn"
            id="moreBtn"
            aria-label="更多选项"
            onClick={handleMoreClick}
          >
            <RiMore2Line size={24} />
          </button>
          
          <div 
            className="morph-panel"
            style={{
              width: `${animatedWidth}px`,
              height: `${animatedHeight}px`,
              borderRadius: `${animatedRadius}px`,
              padding: 0,
            }}
          >
            <div 
              className="morph-content"
              style={{
                width: '100%', 
                height: '100%',
                opacity: isMoreOpen ? 1 : 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: isMoreOpen ? 'auto' : 'none',
                overflowY: isCityMenuOpen ? 'auto' : 'hidden',
                overflowX: 'hidden',
              }}
            >
              <div
                className="morph-scroll-area"
                style={{
                  minWidth: isCityMenuOpen ? '160px' : '140px',
                  padding: isMoreOpen ? '12px' : '8px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px',
                  minHeight: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {!isCityMenuOpen ? (
                  <>
                    <div
                      className={`morph-item ${currentView === 'time' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleViewSwitch('time'); }}
                    >
                      显示时间
                    </div>
                    <div
                      className={`morph-item ${currentView === 'decibel' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleViewSwitch('decibel'); }}
                    >
                      分贝仪
                    </div>
                    <div
                      className="morph-item"
                      onClick={(e) => { e.stopPropagation(); setIsCityMenuOpen(true); }}
                    >
                      选择地区
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="morph-item"
                      style={{ fontWeight: 'bold' }}
                      onClick={(e) => { e.stopPropagation(); setIsCityMenuOpen(false); }}
                    >
                      ← 返回
                    </div>
                    {CITIES.map(c => (
                      <div
                        key={c.name}
                        className={`morph-item ${currentCity.name === c.name ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleCitySelect(c); }}
                      >
                        {c.name}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
