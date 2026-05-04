import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CoCTracker.css';

const CoCTracker = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [builders, setBuilders] = useState([]);
  const [summary, setSummary] = useState({});
  const [newAccName, setNewAccName] = useState('');
  const [newAccTH, setNewAccTH] = useState('');
  
  const [cocTab, setCocTab] = useState('dashboard');
  const [allBuilders, setAllBuilders] = useState([]);
  
  // Ref to hold the latest builders so setInterval has fresh data without re-rendering issues
  const buildersRef = useRef(builders);

  // Initial load
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    fetchAccounts();
    fetchSummary();
  }, []);

  // When account changes
  useEffect(() => {
    if (selectedAccountId) {
      fetchBuilders(selectedAccountId);
    } else {
      setBuilders([]);
    }
  }, [selectedAccountId]);

  // Keep ref updated
  useEffect(() => {
    buildersRef.current = builders;
  }, [builders]);

  // Countdown timer logic
  useEffect(() => {
    const timerId = setInterval(() => {
      let needsFetch = false;
      const now = new Date().getTime();
      
      const updatedBuilders = buildersRef.current.map(b => {
        if (b.is_free || !b.finish_time) return b;
        
        const finishMs = new Date(b.finish_time).getTime();
        const diff = finishMs - now;
        
        if (diff <= 0) {
          // Reached zero
          needsFetch = true;
          // Send patch
          axios.patch(`http://127.0.0.1:8000/api/coc/builders/${b.id}/`, {
            is_free: true,
            finish_time: null,
            current_task: ''
          }).catch(console.error);
          
          if (Notification.permission === 'granted') {
             const accName = b.account_name || 'your account';
             const bName = b.is_bob ? 'B.O.B' : `Builder ${b.builder_number}`;
             new Notification('LifeOS — Builder Free!', {
               body: `${bName} on ${accName} is now free!`
             });
          }
          
          return { ...b, is_free: true, finish_time: null, current_task: '', _remaining: null };
        } else {
          // Format time remaining
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          let remStr = '';
          if(days > 0) remStr += `${days}d `;
          if(hours > 0 || days > 0) remStr += `${hours}h `;
          remStr += `${minutes}m ${seconds}s`;
          
          return { ...b, _remaining: remStr };
        }
      });

      setBuilders(updatedBuilders);

      if (needsFetch) {
        fetchSummary();
      }
      
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/coc/accounts/');
      setAccounts(res.data);
      if (res.data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBuilders = async (accId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/coc/builders/?account_id=${accId}`);
      setBuilders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/coc/free-builders/');
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccName.trim()) return;
    try {
      const accRes = await axios.post('http://127.0.0.1:8000/api/coc/accounts/', {
        name: newAccName,
        town_hall_level: newAccTH || 1
      });
      const newAcc = accRes.data;
      
      // Auto-create 6 builders
      const builderPromises = [];
      for (let i = 1; i <= 6; i++) {
        builderPromises.push(axios.post('http://127.0.0.1:8000/api/coc/builders/', {
          account: newAcc.id,
          builder_number: i,
          is_bob: i === 6,
          is_free: true
        }));
      }
      await Promise.all(builderPromises);
      
      setNewAccName('');
      setNewAccTH('');
      fetchAccounts();
      setSelectedAccountId(newAcc.id);
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const updateBuilder = async (builder, field, value) => {
    try {
      // Local optimistic update
      setBuilders(builders.map(b => b.id === builder.id ? { ...b, [field]: value } : b));
      
      const payload = { [field]: value };
      if (field === 'finish_time') {
         payload.is_free = !value; // if value exists, it's not free.
      }
      
      await axios.patch(`http://127.0.0.1:8000/api/coc/builders/${builder.id}/`, payload);
      fetchSummary();
    } catch (err) {
      console.error(err);
      fetchBuilders(selectedAccountId); // Revert on fail
    }
  };

  const setBuilderFree = async (builder) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/coc/builders/${builder.id}/`, {
        is_free: true,
        finish_time: null,
        current_task: ''
      });
      fetchBuilders(selectedAccountId);
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllBuilders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/coc/builders/');
      setAllBuilders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (cocTab === 'timeline') {
      fetchAllBuilders();
    }
  }, [cocTab]);

  const getLocalDateString = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const generateTimeline = () => {
    const currentlyFree = [];
    const timelineDays = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      timelineDays[getLocalDateString(d)] = {
        dateObj: d,
        builders: []
      };
    }

    allBuilders.forEach(b => {
      if (b.is_free || !b.finish_time) {
        currentlyFree.push(b);
        return;
      }
      const finishDate = new Date(b.finish_time);
      if (finishDate.getTime() <= new Date().getTime()) {
        currentlyFree.push(b);
        return;
      }
      const dStr = getLocalDateString(finishDate);
      if (timelineDays[dStr]) {
        timelineDays[dStr].builders.push(b);
      }
    });
    
    return { currentlyFree, timelineDays };
  };

  const getDayLabel = (dateObj) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateObj.toDateString() === today.toDateString()) {
      return `Today (${dateObj.toLocaleDateString(undefined, {month:'short', day:'numeric'})})`;
    }
    if (dateObj.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow (${dateObj.toLocaleDateString(undefined, {month:'short', day:'numeric'})})`;
    }
    return dateObj.toLocaleDateString(undefined, {month:'short', day:'numeric'});
  };

  const renderTimelineTab = () => {
    const { currentlyFree, timelineDays } = generateTimeline();

    return (
      <div className="coc-timeline fade-in">
        <div className="coc-timeline-card free-section">
          <h3>Currently Free ({currentlyFree.length})</h3>
          {currentlyFree.length > 0 ? (
            <p>
              {currentlyFree.map(b => `${b.account_name} - ${b.is_bob ? 'B.O.B' : 'Builder ' + b.builder_number}`).join(', ')}
            </p>
          ) : (
            <p className="empty-text">No builders are currently free.</p>
          )}
        </div>

        {Object.values(timelineDays).map(dayData => (
          <div key={dayData.dateObj.toISOString()} className="coc-timeline-card">
            <h4>{getDayLabel(dayData.dateObj)}</h4>
            {dayData.builders.length > 0 ? (
               <p>
                 {dayData.builders.map(b => `${b.account_name} - ${b.is_bob ? 'B.O.B' : 'Builder ' + b.builder_number}`).join(', ')}
               </p>
            ) : (
               <p className="empty-text">No builders finishing this day.</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // formatting helper for datetime-local
  const formatForInput = (isoStr) => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    // adjust to local timezone
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0,16);
  };

  return (
    <div className="coc-container fade-in">
      
      <div className="coc-summary">
        <h3>Free Builders Summary</h3>
        <p>
          {Object.keys(summary).length === 0 ? "No free builders across any account." : 
            Object.entries(summary).map(([accName, freeBuilders]) => (
              <span key={accName} style={{marginRight: '15px'}}>
                <strong>{accName}:</strong> {freeBuilders.length} free
              </span>
            ))
          }
        </p>
      </div>

      <div className="coc-tabs">
        <button 
          className={`coc-tab-btn ${cocTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCocTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`coc-tab-btn ${cocTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setCocTab('timeline')}
        >
          Timeline
        </button>
      </div>

      <div className="coc-main">
        {cocTab === 'dashboard' ? (
          <>
            {/* ACCOUNT PANEL */}
            <div className="coc-accounts">
              <h3>Accounts</h3>
              <div className="coc-account-add">
                <input 
                  placeholder="Account Name" 
                  value={newAccName} 
                  onChange={e => setNewAccName(e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="TH Level" 
                  value={newAccTH} 
                  onChange={e => setNewAccTH(e.target.value)} 
                />
                <button onClick={handleAddAccount}>Add Account</button>
              </div>
              <div className="coc-account-list">
                {accounts.map(acc => (
                  <div 
                    key={acc.id} 
                    className={`coc-account-item ${selectedAccountId === acc.id ? 'active' : ''}`}
                    onClick={() => setSelectedAccountId(acc.id)}
                  >
                    {acc.name} (TH{acc.town_hall_level})
                  </div>
                ))}
              </div>
            </div>

            {/* BUILDERS PANEL */}
            <div className="coc-builders">
              {builders.map(b => (
                <div key={b.id} className="coc-builder-card">
                  <div className="coc-builder-header">
                    <h4 style={{margin: 0}}>{b.is_bob ? 'B.O.B' : `Builder ${b.builder_number}`}</h4>
                    <span className={`coc-badge ${b.is_free ? 'free' : 'busy'}`}>
                      {b.is_free ? 'FREE' : 'BUSY'}
                    </span>
                  </div>
                  
                  <input 
                    className="coc-builder-input"
                    placeholder="Current Task..." 
                    value={b.current_task || ''}
                    onChange={e => updateBuilder(b, 'current_task', e.target.value)}
                  />
                  
                  <input 
                    type="datetime-local" 
                    className="coc-builder-input"
                    value={formatForInput(b.finish_time)}
                    onChange={e => {
                      const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                      updateBuilder(b, 'finish_time', val);
                    }}
                  />
                  
                  {!b.is_free && b._remaining && (
                    <div className="coc-countdown">
                      {b._remaining}
                    </div>
                  )}
                  
                  {!b.is_free && (
                    <button className="coc-btn-free" onClick={() => setBuilderFree(b)}>
                      Set Free
                    </button>
                  )}
                </div>
              ))}
              {builders.length === 0 && selectedAccountId && (
                <p style={{ gridColumn: 'span 2' }}>No builders found for this account.</p>
              )}
            </div>
          </>
        ) : (
          renderTimelineTab()
        )}
      </div>
    </div>
  );
};

export default CoCTracker;
