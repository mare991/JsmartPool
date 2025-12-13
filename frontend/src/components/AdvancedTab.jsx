import React from 'react';
import './AdvancedTab.css';

const AdvancedTab = ({ temp, phLevel, orpValue = 767 }) => {
  // Mock data for diagnostics - these would come from backend in real implementation
  const calibrationPhCorrection = 0.02;
  const phVoltage = 1365;
  const phCorrection = 0.05;
  const phDirect = 7.22;
  
  return (
    <div className="advanced-tab">
      <div className="advanced-content">
        <div className="readings-section">
          <div className="section-header">
            <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="M7 12l4-4 4 4 6-6"/>
            </svg>
            <h2 className="section-title">Live Readings</h2>
          </div>
          
          <div className="reading-item highlighted">
            <span className="reading-label">Current Temperature</span>
            <span className="reading-value temp-value">{temp.toFixed(1)} °C</span>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">pH Level</span>
            <span className="reading-value">{phLevel.toFixed(2)}</span>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">ORP Value</span>
            <span className="reading-value">{orpValue} mV</span>
          </div>
        </div>
        
        <div className="diagnostics-section">
          <div className="section-header">
            <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
            <h2 className="section-title">pH Calibration & Diagnostics</h2>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">Calibration pH Correction</span>
            <span className="reading-value">{calibrationPhCorrection > 0 ? '+' : ''}{calibrationPhCorrection.toFixed(2)}</span>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">pH Voltage</span>
            <span className="reading-value">{phVoltage} mV</span>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">pH Correction</span>
            <span className="reading-value">{phCorrection.toFixed(2)}</span>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">pH Direct</span>
            <span className="reading-value">{phDirect.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTab;


