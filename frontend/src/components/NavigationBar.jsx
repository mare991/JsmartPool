import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="navigation-bar">
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="12" x2="12" y2="2"/>
            <line x1="12" y1="12" x2="20" y2="12"/>
          </svg>
          Monitor
        </button>
        <button 
          className={`nav-tab ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
          Advanced
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
