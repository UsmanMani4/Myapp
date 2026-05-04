import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HabitTracker.css';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/habits/?date=${today}`);
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    try {
      await axios.post('http://127.0.0.1:8000/api/habits/', {
        date: today,
        habit_name: newHabitName,
        is_done: false
      });
      setNewHabitName('');
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (habit) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/habits/${habit.id}/`, {
        is_done: !habit.is_done
      });
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/habits/${id}/`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const doneCount = habits.filter(h => h.is_done).length;
  const totalCount = habits.length;

  return (
    <div className="habit-container fade-in">
      <div className="habit-header">
        <h2>Daily Habits</h2>
        <span>{doneCount} of {totalCount} habits done today</span>
      </div>

      <div className="habit-add">
        <input
          type="text"
          placeholder="New habit for today..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <div className="habit-list">
        {habits.map(h => (
          <div key={h.id} className="habit-item">
            <div className="habit-item-left" onClick={() => toggleHabit(h)}>
              <input 
                type="checkbox" 
                checked={h.is_done} 
                onChange={() => toggleHabit(h)}
                onClick={(e) => e.stopPropagation()}
              />
              <span style={{ textDecoration: h.is_done ? 'line-through' : 'none', color: h.is_done ? '#888' : 'inherit' }}>
                {h.habit_name}
              </span>
            </div>
            <button className="habit-delete" onClick={() => deleteHabit(h.id)}>🗑️</button>
          </div>
        ))}
        {habits.length === 0 && <p style={{ textAlign: 'center', opacity: 0.7 }}>No habits added for today yet.</p>}
      </div>
    </div>
  );
};

export default HabitTracker;
