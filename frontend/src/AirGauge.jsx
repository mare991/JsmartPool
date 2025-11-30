import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import './AirGauge.css';

const poolTypes = [
  { id: 'recreational', name: 'Recreational Pool', min: 26, max: 30, ideal: 28 },
  { id: 'lap', name: 'Lap / Competition Pool', min: 25, max: 28, ideal: 26.5 },
  { id: 'therapy', name: 'Therapy / Rehabilitation Pool', min: 32, max: 35, ideal: 33.5 },
  { id: 'kids', name: 'Kids / Toddler Pool', min: 30, max: 34, ideal: 32 },
  { id: 'spa', name: 'Hot Tub / Spa Pool', min: 36, max: 40, ideal: 38 },
  { id: 'cold', name: 'Cold Plunge Pool', min: 10, max: 15, ideal: 12.5 }
];

export default function AirGauge({
  temp = 40, // °C
  size = 320,
  stroke = 18,
  label = "Excellent",
  phLevel = 7, // pH level (mock data for now, will come from backend)
  selectedPoolType = 'recreational',
  onPoolTypeChange = () => {},
  onTempChange = () => {}
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Get selected pool type
  const poolType = poolTypes.find(p => p.id === selectedPoolType) || poolTypes[0];
  
  // Temperature validation with ±3°C tolerance
  const tolerance = 3;
  const isTooHot = temp > poolType.max + tolerance;
  const isTooCold = temp < poolType.min - tolerance;
  const isAboveIdeal = temp > poolType.max && temp <= poolType.max + tolerance;
  const isBelowIdeal = temp < poolType.min && temp >= poolType.min - tolerance;
  const isIdeal = temp >= poolType.min && temp <= poolType.max;
  
  // Ensure we always show a message - if exactly at boundaries, show ideal
  const shouldShowIdeal = isIdeal || (temp === poolType.min) || (temp === poolType.max);
  
  // Determine circle color based on temperature
  let circleColor = "#87CEEB"; // Light blue for too cold
  if (isTooHot || isAboveIdeal) {
    circleColor = "#FF4500"; // Red for too hot or above ideal
  } else if (isIdeal) {
    circleColor = "#32CD32"; // Green for ideal
  } else if (isTooCold || isBelowIdeal) {
    circleColor = "#87CEEB"; // Light blue for too cold or below ideal
  }

  // Temperature range: 5-45°C (expanded range to cover all pool types)
  const minTemp = 5;
  const maxTemp = 45;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
  const level = ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100;
  const offset = circumference * (1 - level / 100);
  
  // Ensure full circle when at maximum temperature
  const finalOffset = temp === maxTemp ? 0 : offset;

  // Calculate dot position on circle circumference
  const currentAngle = ((temp - minTemp) / (maxTemp - minTemp)) * 2 * Math.PI - Math.PI / 2;
  
  // Use motion value for smooth angle animation
  const angleMotion = useMotionValue(currentAngle);
  const [prevAngle, setPrevAngle] = useState(currentAngle);
  
  useEffect(() => {
    // Calculate shortest path around circle
    let targetAngle = currentAngle;
    let currentAngleValue = angleMotion.get();
    
    // Normalize angles to 0-2π range
    while (currentAngleValue < 0) currentAngleValue += 2 * Math.PI;
    while (targetAngle < 0) targetAngle += 2 * Math.PI;
    
    // Calculate difference and take shortest path
    let diff = targetAngle - currentAngleValue;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    
    const finalAngle = currentAngleValue + diff;
    angleMotion.set(finalAngle);
    setPrevAngle(finalAngle);
  }, [temp, currentAngle, angleMotion]);
  
  // Calculate dot position on the circular progress bar
  // The circle path is at radius 'radius', and stroke width extends equally inward/outward
  // Position dot slightly inside the outer edge for perfect visual alignment
  const dotRadius = 7;
  const dotStrokeWidth = 1;
  // Position dot slightly inside the outer edge (reduce by 1-2px to account for stroke rendering)
  const dotCenterRadius = radius + (stroke / 2) -9;
  const centerX = size / 2;
  const centerY = size / 2;
  const dotX = useTransform(angleMotion, (angle) => {
    return centerX + dotCenterRadius * Math.cos(angle);
  });
  const dotY = useTransform(angleMotion, (angle) => {
    return centerY + dotCenterRadius * Math.sin(angle);
  });

  // Interactive circle functionality
  const handleCircleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const wrapperCenterX = rect.left + rect.width / 2;
    const wrapperCenterY = rect.top + rect.height / 2;
    
    const clickX = event.clientX - wrapperCenterX;
    const clickY = event.clientY - wrapperCenterY;
    
    // Calculate angle from top (0 degrees)
    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Convert to 0-360 from top
    
    // Convert angle to temperature (0-360 degrees = minTemp-maxTemp)
    const newTemp = minTemp + (angle / 360) * (maxTemp - minTemp);
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, Math.round(newTemp)));
    
    onTempChange(clampedTemp);
  };

  return (
    <div className="air-gauge-container">
      {/* Temperature Status Message and pH Level */}
      <div className="top-status-bar">
        {/* Temperature Status Message */}
        <div className="temperature-status">
          {isTooHot && (
            <div className="status-message too-hot">
              Temperature too high! Ideal: {poolType.ideal}°C (Range: {poolType.min}-{poolType.max}°C)
            </div>
          )}
          {isAboveIdeal && !isTooHot && (
            <div className="status-message too-hot">
              Temperature above ideal! Ideal: {poolType.ideal}°C (Range: {poolType.min}-{poolType.max}°C)
            </div>
          )}
          {isTooCold && (
            <div className="status-message too-cold">
              Temperature too low! Ideal: {poolType.ideal}°C (Range: {poolType.min}-{poolType.max}°C)
            </div>
          )}
          {isBelowIdeal && !isTooCold && (
            <div className="status-message too-cold">
              Temperature below ideal! Ideal: {poolType.ideal}°C (Range: {poolType.min}-{poolType.max}°C)
            </div>
          )}
          {shouldShowIdeal && !isTooHot && !isTooCold && !isAboveIdeal && !isBelowIdeal && (
            <div className="status-message ideal">
              Perfect temperature! Ideal: {poolType.ideal}°C (Range: {poolType.min}-{poolType.max}°C)
            </div>
          )}
        </div>

        {/* pH Level - Separate, positioned at right margin */}
        <div className="ph-level-status">
          <div className="ph-level-label-status">pH Level</div>
          <div className="ph-level-value-status">{phLevel}</div>
        </div>
      </div>

      <div 
        className="air-gauge-svg-wrapper" 
        style={{ width: size + 40, height: size + 40, cursor: 'pointer' }}
        onClick={handleCircleClick}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="geometricPrecision">
          <defs>
            {/* Mask to show only up to temperature level */}
            <mask id="tempMask">
              <rect width={size} height={size} fill="black" />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="white"
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: finalOffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </mask>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />

          {/* Color-filled circle based on temperature validation */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={circleColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: finalOffset }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />

          {/* Temperature indicator dot - animated along circle path */}
          <motion.circle
            cx={dotX}
            cy={dotY}
            r={dotRadius}
            fill="white"
            stroke={circleColor}
            strokeWidth={dotStrokeWidth}
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
            transition={{ 
              duration: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          />
        </svg>

        {/* Center content */}
        <div className="air-gauge-center">
          <div className="text-center">
            <div className="air-gauge-temp-label">Temperature</div>
            <div className="air-gauge-temp">{temp}°</div>
          </div>

          {/* Status indicator circle */}
          <div className="emoji-indicator-wrapper">
            <div 
              className="emoji-indicator-circle"
              style={{ 
                backgroundColor: circleColor === "#FF4500" ? "rgba(255, 69, 0, 0.15)" : 
                                 circleColor === "#32CD32" ? "rgba(50, 205, 50, 0.15)" : 
                                 circleColor === "#87CEEB" ? "rgba(135, 206, 235, 0.15)" :
                                 "rgba(255, 255, 255, 0.95)",
                borderColor: circleColor,
                color: circleColor === "#87CEEB" ? "#0984e3" : "inherit"
              }}
            >
            </div>
          </div>
        </div>
      </div>

      {/* Pool Type Selector */}
      <div className="pool-type-selector">
        <label className="pool-type-label">Pool Type:</label>
        <select 
          value={selectedPoolType} 
          onChange={(e) => onPoolTypeChange(e.target.value)}
          className="pool-type-select"
        >
          {poolTypes.map(pool => (
            <option key={pool.id} value={pool.id}>
              {pool.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
