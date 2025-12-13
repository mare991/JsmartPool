import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './MonitorTab.css';

const MonitorTab = ({ temp, targetTemp, phLevel, orpValue = 767, animatedCurrentTemp, onTempChange }) => {
  
  const size = 320;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc is about 270 degrees (3/4 circle) starting from bottom-left
  const arcStartOffset = circumference * (45 / 360); // Start 45 degrees from top
  const arcVisibleLength = circumference * (270 / 360); // Show 270 degrees
  
  const minTemp = 5;
  const maxTemp = 45;
  
  // Use targetTemp for gauge calculation (immediate update)
  const clampedTargetTemp = Math.max(minTemp, Math.min(maxTemp, targetTemp));
  const targetLevel = ((clampedTargetTemp - minTemp) / (maxTemp - minTemp)) * 100;
  const activeLength = arcVisibleLength * (targetLevel / 100);
  const offset = arcVisibleLength - activeLength;
  
  // Calculate angle for dot position (270 degree arc starting from -135 degrees)
  const arcStartAngle = -135;
  const arcEndAngle = 135;
  const arcAngleRange = arcEndAngle - arcStartAngle;
  const targetAngle = arcStartAngle + (targetLevel / 100) * arcAngleRange;
  const targetAngleRad = (targetAngle * Math.PI) / 180;
  
  
  const dotCenterRadius = radius + (stroke / 2) - 9;
  const centerX = size / 2;
  const centerY = size / 2 + 20;
  
  // Calculate dot position directly from target temperature (immediate, no animation)
  const dotX = centerX + dotCenterRadius * Math.cos(targetAngleRad);
  const dotY = centerY + dotCenterRadius * Math.sin(targetAngleRad);
  
  const handleCircleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const wrapperCenterX = rect.left + rect.width / 2;
    const wrapperCenterY = rect.top + rect.height / 2;
    
    const clickX = event.clientX - wrapperCenterX;
    const clickY = event.clientY - wrapperCenterY;
    
    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI);
    // Normalize to arc range (-135 to 135)
    if (angle < -180) angle += 360;
    if (angle > arcEndAngle && angle < 180) {
      if (angle > 180) angle -= 360;
      if (angle < arcStartAngle) angle = arcStartAngle;
    } else if (angle > arcEndAngle) {
      angle = arcEndAngle;
    } else if (angle < arcStartAngle) {
      angle = arcStartAngle;
    }
    
    const normalizedAngle = (angle - arcStartAngle) / arcAngleRange;
    const newTemp = minTemp + normalizedAngle * (maxTemp - minTemp);
    const clampedNewTemp = Math.max(minTemp, Math.min(maxTemp, Math.round(newTemp)));
    
    onTempChange(clampedNewTemp);
  };
  
  // Check if current temp matches target temp (within animation tolerance)
  const tempsMatch = Math.abs(animatedCurrentTemp - targetTemp) < 0.15;
  const isIdeal = targetTemp >= 26 && targetTemp <= 30;
  // Show "Perfect" when temps match (regardless of ideal range), "Adjusting" when they don't match
  const showPerfect = tempsMatch;
  // Circle always uses neon cyan color
  const circleColor = "#00E5FF";
  
  const isOrpGood = orpValue > 650;
  
  return (
    <div className="monitor-tab">
      <div className="target-temperature">
        <div className="target-label">TARGET TEMPERATURE</div>
        <div className="target-value">{targetTemp}°C</div>
      </div>
      
      <div className="monitor-content">
        <div className="left-info">
          <div className={`info-card ph-card ${phLevel >= 7.0 && phLevel <= 7.8 ? 'status-good' : 'status-warning'}`}>
            <div className="card-label">
              <svg className="card-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"/>
              </svg>
              PH LEVEL
            </div>
            <div className="card-value">{phLevel.toFixed(2)}</div>
            <div className={`status-badge-small ${phLevel >= 7.0 && phLevel <= 7.8 ? 'good' : 'warning'}`}>
              {phLevel >= 7.0 && phLevel <= 7.8 ? 'GOOD' : 'WARNING'}
            </div>
          </div>
          
          <div className="info-box water-quality">
            <div className="info-title">Water Quality</div>
            <div className="info-text">pH levels are optimized for skin comfort and sanitation efficiency.</div>
          </div>
        </div>
        
        <div className="gauge-container">
          <div 
            className="gauge-wrapper" 
            style={{ width: size + 40, height: size + 60, cursor: 'pointer', position: 'relative' }}
            onClick={handleCircleClick}
          >
            <svg width={size} height={size + 40} viewBox={`0 0 ${size} ${size + 40}`}>
              <g transform={`rotate(-135 ${size / 2} ${size / 2 + 20})`}>
                {/* Background arc */}
                <circle
                  cx={size / 2}
                  cy={size / 2 + 20}
                  r={radius}
                  stroke="#2D3748"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${arcVisibleLength} ${circumference}`}
                  strokeDashoffset={0}
                />
                
                {/* Active arc - updates immediately, no animation */}
                <circle
                  cx={size / 2}
                  cy={size / 2 + 20}
                  r={radius}
                  stroke={circleColor}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${arcVisibleLength} ${circumference}`}
                  strokeDashoffset={offset}
                />
              </g>
              
              {/* Temperature indicator dot - updates immediately, no animation */}
              <circle
                cx={dotX}
                cy={dotY}
                r={13}
                fill="white"
                stroke={circleColor}
                strokeWidth={5}
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0, 229, 255, 0.5))'
                }}
              />
            </svg>
            
            <div className="gauge-center">
              <div className="current-label">CURRENT</div>
              <div className="current-temp">{animatedCurrentTemp.toFixed(1)}°</div>
              <div className={`status-badge ${showPerfect ? 'perfect' : 'adjusting'}`}>
                {showPerfect ? 'Perfect' : 'Adjusting'}
              </div>
            </div>
          </div>
          
          <div className="gauge-instruction">Drag the ring to set target temperature</div>
        </div>
        
        <div className="right-info">
          <div className={`info-card orp-card ${isOrpGood ? 'status-good' : 'status-warning'}`}>
            <div className="card-label">
              <svg className="card-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              ORP VALUE
            </div>
            <div className="card-value">
              {orpValue} <span className="card-unit">mV</span>
            </div>
            <div className={`status-badge-small ${isOrpGood ? 'good' : 'warning'}`}>
              {isOrpGood ? 'GOOD' : 'WARNING'}
            </div>
          </div>
          
          <div className="info-box sanitization">
            <div className="info-title">Sanitization</div>
            <div className="info-text">ORP indicates the sanitizing power of the water. Above 650mV is ideal.</div>
          </div>
        </div>
      </div>
      
      <div className="monitor-footer">
        <div className="footer-status">
          <div className="footer-item">
            <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <span>Outside Temperature: 18°C</span>
          </div>
          <div className="footer-divider">|</div>
          <div className="footer-item">
            <span>Pump Status: </span>
            <span className="status-running">Running</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorTab;
