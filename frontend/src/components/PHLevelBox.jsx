import React from 'react';
import './PHLevelBox.css';

const PHLevelBox = ({ phLevel }) => {
  const isPhGood = phLevel >= 7.0 && phLevel <= 7.8;
  
  return (
    <div className="ph-level-box">
      <div className="ph-label">PH LEVEL</div>
      <div className="ph-value">{phLevel.toFixed(2)}</div>
      <div className={`ph-status ${isPhGood ? 'good' : ''}`}>
        {isPhGood ? 'GOOD' : 'CHECK'}
      </div>
    </div>
  );
};

export default PHLevelBox;


