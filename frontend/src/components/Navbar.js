import React from 'react';
import phoenixImg from '../assets/bp.jpg';
import './Navbar.css';

function Navbar({ activeTab, setActiveTab, currentTime }) {

  // ✅ UPDATED TABS (added Home)
  const tabs = [
    { name: 'Home', icon: '🏠' },
    { name: 'Notes', icon: '📝' },
    { name: 'Prayer', icon: '🕌' },
    { name: 'Report', icon: '📊' }
  ];

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div className="navbar-left"
        onClick={() => setActiveTab('Home')}
        style={{ cursor: 'pointer' }}
      >
        <img src={phoenixImg} alt="Logo" className="logo" />
        <span className="dashboard-title">LifeOS</span>
      </div>

      {/* CENTER */}
      <div className="navbar-center">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`nav-btn ${activeTab === tab.name ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <div className="clock">
          {currentTime
            ? currentTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            : '--:--'}
        </div>

        <div className="date">
          {currentTime
            ? currentTime.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })
            : '---'}
        </div>
      </div>

      {/* ACCENT BAR */}
      <div className="navbar-accent-bar"></div>

    </nav>
  );
}

export default Navbar;