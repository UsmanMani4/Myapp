import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ setActiveTab }) => {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [cocAccounts, setCocAccounts] = useState([]);
  const [freeBuilders, setFreeBuilders] = useState({});

  useEffect(() => {
    fetchPreviewData();
  }, []);

  const fetchPreviewData = async () => {
    try {
      const notesRes = await axios.get('http://127.0.0.1:8000/api/notes/');
      const tasksRes = await axios.get('http://127.0.0.1:8000/api/tasks/');
      const accRes = await axios.get('http://127.0.0.1:8000/api/coc/accounts/');
      const freeRes = await axios.get('http://127.0.0.1:8000/api/coc/free-builders/');

      // ✅ only take first few items (preview)
      setNotes(notesRes.data.slice(0, 3));
      setTasks(tasksRes.data.slice(0, 3));
      setCocAccounts(accRes.data);
      setFreeBuilders(freeRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-container fade-in">

      {/* HERO */}
      <div className="home-hero">
        <h1>LifeOS</h1>
        <p>Your personal discipline system</p>
      </div>

      {/* PREVIEW GRID */}
      <div className="home-preview-grid">

        {/* NOTES PREVIEW */}
        <div className="home-card"
            onClick={() => setActiveTab('Notes')}>
          <h3>📝 Recent Notes</h3>
          {notes.length === 0 ? (
            <p>No notes yet</p>
          ) : (
            notes.map(n => (
              <div key={n.id} className="home-item">
                {n.content}
              </div>
            ))
          )}
        </div>

        {/* TASKS PREVIEW */}
        <div className="home-card"
            onClick={() => setActiveTab('Tasks')}
        >
          <h3>✅ Tasks</h3>
          {tasks.length === 0 ? (
            <p>No tasks yet</p>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="home-item">
                {t.title} {t.is_completed ? '✔' : ''}
              </div>
            ))
          )}
        </div>

        {/* COC PREVIEW */}
        <div className="home-card"
            onClick={() => setActiveTab('CoC')}
        >
          <h3>⚔️ Clash of Clans</h3>
          {cocAccounts.length === 0 ? (
            <p>No accounts tracked.</p>
          ) : (
            <>
              <p style={{marginBottom: '15px', fontSize: '0.95rem', opacity: 0.8}}>
                {Object.values(freeBuilders).flat().length} builders are currently free across {cocAccounts.length} accounts
              </p>
              {cocAccounts.map(acc => {
                const freeCount = freeBuilders[acc.name] ? freeBuilders[acc.name].length : 0;
                const totalBuilders = 6;
                const busyCount = totalBuilders - freeCount;
                
                return (
                  <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{fontWeight: 'bold'}}>{acc.name}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(freeCount)].map((_, i) => (
                        <div key={`free-${i}`} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4caf50' }} title="Free" />
                      ))}
                      {[...Array(busyCount)].map((_, i) => (
                        <div key={`busy-${i}`} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f44336' }} title="Busy" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default Home;