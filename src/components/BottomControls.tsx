import { useState, useRef, useEffect } from 'react';

interface BottomControlsProps {
    currentMode: string;
    onToggleMode: () => void;
    currentView: 'time' | 'decibel';
    onSwitchView: (view: 'time' | 'decibel') => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({ currentMode, onToggleMode, currentView, onSwitchView }) => {
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

    const handleViewSwitch = (view: 'time' | 'decibel') => {
        onSwitchView(view);
        setIsMoreOpen(false);
    };

    return (
        <div className="bottom-controls">
            <div className="controls-row">
                <button className="icon-btn" id="fullscreenBtn" aria-label={isFullscreen ? '关闭全屏' : '打开全屏'} onClick={toggleFullscreen}>
                    <span className="material-symbols-rounded" id="fullscreenIcon">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                </button>
                <button className="icon-btn" id="modeToggle" aria-label={currentMode === 'minimal' ? '打开背景' : '关闭背景'} onClick={onToggleMode}>
                    <span className="material-symbols-rounded" id="modeIcon">{currentMode === 'minimal' ? 'hide_image' : 'image'}</span>
                </button>
                <div className={`more-container ${isMoreOpen ? 'open' : ''}`} id="moreContainer" ref={moreContainerRef}>
                    <button className="icon-btn" id="moreBtn" aria-label="更多选项" onClick={() => setIsMoreOpen(!isMoreOpen)}>
                        <span className="material-symbols-rounded">more_vert</span>
                    </button>
                    <div className="morph-panel" id="morphPanel">
                        <div 
                            className={`morph-item ${currentView === 'time' ? 'active' : ''}`} 
                            data-view="time"
                            onClick={() => handleViewSwitch('time')}
                        >
                            显示时间
                        </div>
                        <div 
                            className={`morph-item ${currentView === 'decibel' ? 'active' : ''}`} 
                            data-view="decibel"
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
