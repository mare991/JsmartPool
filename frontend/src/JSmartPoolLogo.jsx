import React from 'react';
import './JSmartPoolLogo.css';

const JSmartPoolLogo = ({ className = '' }) => {
  return (
    <div className={`jsmartpool-logo ${className}`}>
      <div className="logo-text-container">
        <div className="logo-text">JSmartPool</div>
        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </div>
    </div>
  );
};

export default JSmartPoolLogo;
