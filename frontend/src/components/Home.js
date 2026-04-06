import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ setActiveTab }) => {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchPreviewData();
  }, []);

  const fetchPreviewData = async () => {
    try {
      const notesRes = await axios.get('http://127.0.0.1:8000/api/notes/');
      const tasksRes = await axios.get('http://127.0.0.1:8000/api/tasks/');

      // ✅ only take first few items (preview)
      setNotes(notesRes.data.slice(0, 3));
      setTasks(tasksRes.data.slice(0, 3));

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

      </div>

    </div>
  );
};

export default Home;