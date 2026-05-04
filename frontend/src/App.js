import React, { useState, useEffect } from 'react';
import Notes from './components/Notes';
import Prayer from './components/Prayer';
import Navbar from './components/Navbar';
import Report from './components/Report';
import Home from './components/Home';
import HabitTracker from './components/HabitTracker';
import Finance from './components/Finance';
import CoCTracker from './components/CoCTracker';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTime={currentTime}
      />

      {/* CONTENT */}
      <main className="tab-content fade-in">
        {activeTab === 'Home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'Notes' && <Notes />}
        {activeTab === 'Prayer' && <Prayer />}
        {activeTab === 'Habits' && <HabitTracker />}
        {activeTab === 'Finance' && <Finance />}
        {activeTab === 'CoC' && <CoCTracker />}
        {activeTab === 'Report' && <Report />}
      </main>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>@LifeOS Redemption Process</p>
      </footer>
    </div>
  );
}

export default App;