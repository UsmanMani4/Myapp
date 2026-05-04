import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Prayer.css';

const Prayer = () => {
  const [prayer, setPrayer] = useState({});
  const [changes, setChanges] = useState({});
  const today = new Date().toISOString().split('T')[0];

  const [fasting, setFasting] = useState(null);
  const [didFast, setDidFast] = useState(false);
  const [fastingNote, setFastingNote] = useState('');

  useEffect(() => {
    fetchPrayer();
    fetchFasting();
  }, []);

  const fetchFasting = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/fasting/?date=${today}`);
      if (res.data && res.data.length > 0) {
        const todayFasting = res.data[0];
        setFasting(todayFasting);
        setDidFast(todayFasting.did_fast);
        setFastingNote(todayFasting.note || '');
      } else {
        setFasting(null);
        setDidFast(false);
        setFastingNote('');
      }
    } catch (err) {
      console.error('Failed to fetch fasting:', err);
    }
  };

  const submitFasting = async (newDidFast, newNote) => {
    try {
      if (!fasting) {
        const res = await axios.post(`http://127.0.0.1:8000/api/fasting/`, { 
          date: today, 
          did_fast: newDidFast,
          note: newNote
        });
        setFasting(res.data);
      } else {
        const res = await axios.patch(`http://127.0.0.1:8000/api/fasting/${fasting.id}/`, { 
          did_fast: newDidFast,
          note: newNote
        });
        setFasting(res.data);
      }
    } catch (err) {
      console.error('Failed to update fasting:', err);
    }
  };

  const handleFastToggle = () => {
    const newVal = !didFast;
    setDidFast(newVal);
    submitFasting(newVal, fastingNote);
  };
  
  const saveFastingNote = () => {
    submitFasting(didFast, fastingNote);
  };

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

      {/* FASTING SECTION */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Today's Fast</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <button 
            onClick={handleFastToggle}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              background: didFast ? '#4caf50' : '#e0e0e0',
              color: didFast ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: '0.2s'
            }}
          >
            {didFast ? '✅ Fasting' : '❌ Not Fasting'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Short note (e.g. feeling good)" 
            value={fastingNote}
            onChange={(e) => setFastingNote(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '0.7rem', 
              borderRadius: '12px', 
              border: '1px solid #ccc',
              fontFamily: 'inherit'
            }}
          />
          <button 
            onClick={saveFastingNote} 
            className="prayer-submit"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prayer;