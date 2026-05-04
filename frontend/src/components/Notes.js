import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notes.css';

const Notes = () => {
  // NOTES STATE
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteText, setEditNoteText] = useState('');

  // TASKS STATE
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState('Medium');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');

  // SEARCH AND FILTER STATE
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('All');

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
    if (!noteTitle.trim() && !noteText.trim()) return;  // block only when both are empty

    await axios.post('http://127.0.0.1:8000/api/notes/', {
      title: noteTitle,
      content: noteText,
      is_completed: false
    });

    setNoteTitle('');
    setNoteText('');
    setShowNoteInput(false);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`);
    fetchNotes();
  };

  const togglePin = async (id, isPinned) => {
    await axios.patch(`http://127.0.0.1:8000/api/notes/${id}/`, {
      is_pinned: !isPinned
    });
    fetchNotes();
  };

  const startEditNote = (n) => {
    setEditingNoteId(n.id);
    setEditNoteTitle(n.title);
    setEditNoteText(n.content);
  };

  const saveEditNote = async (id) => {
    if (!editNoteTitle.trim()) return;
    await axios.patch(`http://127.0.0.1:8000/api/notes/${id}/`, {
      title: editNoteTitle,
      content: editNoteText
    });
    setEditingNoteId(null);
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
      priority: taskPriority,
      due_date: taskDueDate || null,
      is_completed: false
    });

    setTitle('');
    setDesc('');
    setTaskPriority('Medium');
    setTaskDueDate('');
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

  const clearCompleted = async () => {
    const completed = tasks.filter(t => t.is_completed);
    if (completed.length === 0) return;
    await Promise.all(
      completed.map(t => axios.delete(`http://127.0.0.1:8000/api/tasks/${t.id}/`))
    );
    fetchTasks();
  };

  const startEditTask = (t) => {
    setEditingTaskId(t.id);
    setEditTaskTitle(t.title);
    setEditTaskDesc(t.description);
    setEditTaskPriority(t.priority || 'Medium');
    setEditTaskDueDate(t.due_date || '');
  };

  const saveEditTask = async (id) => {
    if (!editTaskTitle.trim()) return;
    await axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      title: editTaskTitle,
      description: editTaskDesc,
      priority: editTaskPriority,
      due_date: editTaskDueDate || null
    });
    setEditingTaskId(null);
    fetchTasks();
  };

  // Pinned notes first, then the rest — both groups filtered by search
  const filteredNotes = notes
    .filter(n => {
      const t = (n.title || '').toLowerCase();
      const c = (n.content || '').toLowerCase();
      const q = noteSearchQuery.toLowerCase();
      return t.includes(q) || c.includes(q);
    })
    .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  const completedCount = tasks.filter(t => t.is_completed).length;
  const totalCount = tasks.length;

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearchQuery.toLowerCase());
    const matchesFilter = taskFilter === 'All' ? true : 
                          taskFilter === 'Completed' ? t.is_completed : 
                          !t.is_completed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="notes-container">

      {/* LEFT: NOTES */}
      <div className="notes-panel">
        <h2>Quick Notes</h2>

        <input 
          type="text" 
          placeholder="Search notes..." 
          value={noteSearchQuery}
          onChange={(e) => setNoteSearchQuery(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}
        />

        {/* + BUTTON */}
        <button onClick={() => setShowNoteInput(!showNoteInput)} style={{ marginBottom: '15px' }}>
          + Add Note
        </button>

        {/* INPUT (toggle) */}
        {showNoteInput && (
          <div className="notes-add">
            <input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
            />
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write anything..."
            />
            <button onClick={addNote}>Save</button>
          </div>
        )}

        {/* NOTES LIST */}
        {filteredNotes.length === 0 && <p style={{opacity: 0.7}}>No notes found.</p>}
        {filteredNotes.map(n => {
          const dateStr = n.created_at ? new Date(n.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '';

          const isEditing = editingNoteId === n.id;
          return (
            <div key={n.id} className={`note-item${n.is_pinned ? ' note-pinned' : ''}`}>
              {isEditing ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <input
                    value={editNoteTitle}
                    onChange={(e) => setEditNoteTitle(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  <textarea
                    value={editNoteText}
                    onChange={(e) => setEditNoteText(e.target.value)}
                    style={{ width: '100%', padding: '5px', minHeight: '60px' }}
                  />
                  <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    <button onClick={() => saveEditNote(n.id)} style={{ padding: '5px 10px' }}>Save</button>
                    <button onClick={() => setEditingNoteId(null)} style={{ padding: '5px 10px', background: '#ccc', color: '#000' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {n.is_pinned && <span className="pin-indicator" title="Pinned">📌</span>}
                      {n.title && <strong style={{ fontSize: '1.1rem' }}>{n.title}</strong>}
                    </div>
                    {n.content && <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{n.content}</p>}
                    {dateStr && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>{dateStr}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <button
                      onClick={() => togglePin(n.id, n.is_pinned)}
                      title={n.is_pinned ? 'Unpin' : 'Pin'}
                      className={`pin-btn${n.is_pinned ? ' pinned' : ''}`}
                    >📌</button>
                    <button onClick={() => startEditNote(n)} title="Edit">✏️</button>
                    <button onClick={() => deleteNote(n.id)} title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT: TASKS */}
      <div className="tasks-panel">
        <h2>Tasks</h2>

        {/* TASK COUNTER */}
        {totalCount > 0 && (
          <div className="task-counter">
            <span>{completedCount} of {totalCount} tasks completed</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="clear-completed-btn"
                title="Delete all completed tasks"
              >
                🗑 Clear Completed
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={taskSearchQuery}
            onChange={(e) => setTaskSearchQuery(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1, minWidth: 0 }}
          />
          <select 
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* + BUTTON */}
        <button onClick={() => setShowTaskInput(!showTaskInput)} style={{ marginBottom: '15px' }}>
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select 
                value={taskPriority} 
                onChange={e => setTaskPriority(e.target.value)}
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <input 
                type="date" 
                value={taskDueDate} 
                onChange={e => setTaskDueDate(e.target.value)}
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
              />
            </div>
            <button onClick={addTask}>Save Task</button>
          </div>
        )}

        {/* TASK LIST */}
        {filteredTasks.length === 0 && <p style={{opacity: 0.7}}>No tasks found.</p>}
        {filteredTasks.map(t => {
          const isEditing = editingTaskId === t.id;
          const isOverdue = t.due_date && new Date(t.due_date).getTime() < new Date().setHours(0,0,0,0) && !t.is_completed;
          return (
            <div key={t.id} className="task-item" style={{ borderLeft: isOverdue ? '5px solid #f44336' : '' }}>
              {isEditing ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <input
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  <textarea
                    value={editTaskDesc}
                    onChange={(e) => setEditTaskDesc(e.target.value)}
                    style={{ width: '100%', padding: '5px', minHeight: '40px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                      value={editTaskPriority} 
                      onChange={e => setEditTaskPriority(e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input 
                      type="date" 
                      value={editTaskDueDate} 
                      onChange={e => setEditTaskDueDate(e.target.value)}
                      style={{ padding: '5px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    <button onClick={() => saveEditTask(t.id)} style={{ padding: '5px 10px' }}>Save</button>
                    <button onClick={() => setEditingTaskId(null)} style={{ padding: '5px 10px', background: '#ccc', color: '#000' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      checked={t.is_completed}
                      onChange={() => toggleTask(t.id, t.is_completed)}
                      style={{ marginTop: '5px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>{t.title}</strong>
                        <span style={{ 
                          fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', color: 'white',
                          background: t.priority === 'High' ? '#f44336' : t.priority === 'Low' ? '#4caf50' : '#ff9800' 
                        }}>
                          {t.priority || 'Medium'}
                        </span>
                      </div>
                      {t.due_date && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>Due: {t.due_date}</div>}
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#555' }}>{t.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <button onClick={() => startEditTask(t)} title="Edit">✏️</button>
                    <button onClick={() => deleteTask(t.id)} title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Notes;