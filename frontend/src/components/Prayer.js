import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Prayer.css';

const Prayer = () => {
  const [prayer, setPrayer] = useState({});
  const [changes, setChanges] = useState({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchPrayer();
  }, []);

  const fetchPrayer = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/prayers/`);
      const todayPrayer = res.data.find(p => p.date === today);
      setPrayer(todayPrayer || { date: today, fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false });
      setChanges(todayPrayer || {});
    } catch (err) {
      console.error('Failed to fetch prayer:', err);
    }
  };

  const handleToggle = (field) => {
    setChanges({ ...changes, [field]: !changes[field] });
  };

  const submitPrayer = async () => {
    try {
      if (!prayer.id) {
        const res = await axios.post(`http://127.0.0.1:8000/api/prayers/`, { ...changes, date: today });
        setPrayer(res.data);
      } else {
        const res = await axios.patch(`http://127.0.0.1:8000/api/prayers/${prayer.id}/`, changes);
        setPrayer(res.data);
      }
    } catch (err) {
      console.error('Failed to update prayer:', err);
    }
  };

  return (
    <div className="prayer-card fade-in">
      <h2>Prayer Tracker</h2>
      <div className="prayer-list">
        {['fajr','dhuhr','asr','maghrib','isha'].map(p => (
          <label key={p} className="prayer-item">
            <input
              type="checkbox"
              checked={changes[p] || false}
              onChange={() => handleToggle(p)}
            />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </label>
        ))}
      </div>
      <button className="prayer-submit" onClick={submitPrayer}>Submit Prayer</button>
    </div>
  );
};

export default Prayer;