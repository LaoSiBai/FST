import { useDecibelMeter } from '../hooks/useDecibelMeter';

interface DecibelViewProps {
  isActive: boolean;
}

export const DecibelView: React.FC<DecibelViewProps> = ({ isActive }) => {
  const { dbCurrent, dbAvg, elapsedTime, error } = useDecibelMeter(isActive);

  if (error) {
    return (
      <div className="main-container decibel-container">
        <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Mono, sans-serif' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '40px', marginBottom: '10px' }}>mic_off</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container decibel-container">
      <div className="decibel-main">
        <span className="decibel-value">{dbCurrent}</span>
        <span className="decibel-unit">dB</span>
      </div>
      <div className="decibel-stats">
        <div className="stat-item">
          <div className="stat-label">平均分贝</div>
          <div className="stat-value">{dbAvg} dB</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">测量时间</div>
          <div className="stat-value">{elapsedTime}</div>
        </div>
      </div>
    </div>
  );
};
