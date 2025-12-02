import React from 'react';
import './JSmartPoolLogo.css';

const JSmartPoolLogo = ({ className = '' }) => {
  return (
    <div className={`jsmartpool-logo ${className}`}>
      <img 
        src="/logo4.png" 
        alt="JSmartPool Logo" 
        className="logo-image"
      />
    </div>
  );
};

export default JSmartPoolLogo;