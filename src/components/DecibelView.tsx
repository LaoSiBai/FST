import { useDecibelMeter } from '../hooks/useDecibelMeter';

interface DecibelViewProps {
    isActive: boolean;
}

export const DecibelView: React.FC<DecibelViewProps> = ({ isActive }) => {
    const { dbCurrent, dbAvg, elapsedTime, error } = useDecibelMeter(isActive);

    if (error) {
        return (
            <div className="main-container decibel-container" id="decibelViewContainer">
                <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Mono, sans-serif' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '40px', marginBottom: '10px' }}>mic_off</span>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container decibel-container" id="decibelViewContainer">
            <div className="decibel-main">
                <span className="decibel-value" id="dbCurrent">{dbCurrent}</span>
                <span className="decibel-unit">dB</span>
            </div>
            <div className="decibel-stats">
                <div className="stat-item">
                    <div className="stat-label">平均分贝</div>
                    <div className="stat-value" id="dbAvg">{dbAvg} dB</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">测量时间</div>
                    <div className="stat-value" id="dbTime">{elapsedTime}</div>
                </div>
            </div>
        </div>
    );
};
