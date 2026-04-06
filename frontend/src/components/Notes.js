import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notes.css';

const Notes = () => {
  // NOTES STATE
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // TASKS STATE
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  // -------- NOTES --------
  const fetchNotes = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/notes/');
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!noteText.trim()) return;

    await axios.post('http://127.0.0.1:8000/api/notes/', {
      content: noteText,   // ✅ FIXED (was text)
      is_completed: false
    });

    setNoteText('');
    setShowNoteInput(false);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`);
    fetchNotes();
  };

  // -------- TASKS --------
  const fetchTasks = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/tasks/');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post('http://127.0.0.1:8000/api/tasks/', {
      title,
      description: desc,
      is_completed: false
    });

    setTitle('');
    setDesc('');
    setShowTaskInput(false);
    fetchTasks();
  };

  const toggleTask = async (id, status) => {
    await axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      is_completed: !status
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`);
    fetchTasks();
  };

  return (
    <div className="notes-container">

      {/* LEFT: NOTES */}
      <div className="notes-panel">
        <h2>Quick Notes</h2>

        {/* + BUTTON */}
        <button onClick={() => setShowNoteInput(!showNoteInput)}>
          + Add Note
        </button>

        {/* INPUT (toggle) */}
        {showNoteInput && (
          <div className="notes-add">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write anything..."
            />
            <button onClick={addNote}>Save</button>
          </div>
        )}

        {/* NOTES LIST */}
        {notes.map(n => (
          <div key={n.id} className="note-item">
            <span>{n.content}</span> {/* ✅ FIXED */}
            <button onClick={() => deleteNote(n.id)}>🗑️</button>
          </div>
        ))}
      </div>

      {/* RIGHT: TASKS */}
      <div className="tasks-panel">
        <h2>Tasks</h2>

        {/* + BUTTON */}
        <button onClick={() => setShowTaskInput(!showTaskInput)}>
          + Add Task
        </button>

        {/* INPUT (toggle) */}
        {showTaskInput && (
          <div className="task-add">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
            />
            <button onClick={addTask}>Save Task</button>
          </div>
        )}

        {/* TASK LIST */}
        {tasks.map(t => (
          <div key={t.id} className="task-item">
            <div>
              <input
                type="checkbox"
                checked={t.is_completed}
                onChange={() => toggleTask(t.id, t.is_completed)}
              />
              <strong>{t.title}</strong>
              <p>{t.description}</p>
            </div>
            <button onClick={() => deleteTask(t.id)}>🗑️</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Notes;