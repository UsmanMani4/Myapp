import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';

const Report = () => {
  const [notesCount, setNotesCount] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const notesRes = await axios.get('http://127.0.0.1:8000/api/notes/');
      const tasksRes = await axios.get('http://127.0.0.1:8000/api/tasks/');

      setNotesCount(notesRes.data.length);

      const completed = tasksRes.data.filter(t => t.is_completed).length;
      setTasksCompleted(completed);
      setTotalTasks(tasksRes.data.length);

    } catch (err) {
      console.error(err);
    }
  };

  const productivityScore = totalTasks
    ? Math.round((tasksCompleted / totalTasks) * 100)
    : 0;

  return (
    <div className="report-container">

      <div className="report-card">
        <h3>Total Notes</h3>
        <div className="report-value">{notesCount}</div>
        <div className="report-subtext">All saved notes</div>
      </div>

      <div className="report-card">
        <h3>Tasks Completed</h3>
        <div className="report-value">
          {tasksCompleted} / {totalTasks}
        </div>
        <div className="report-subtext">Completed tasks</div>
      </div>

      <div className="report-card">
        <h3>Productivity Score</h3>
        <div className="report-value">{productivityScore}%</div>
        <div className="report-subtext">Based on task completion</div>
      </div>

      <div className="report-card">
        <h3>Prayer Streak</h3>
        <div className="report-value">--</div>
        <div className="report-subtext">Coming soon</div>
      </div>

    </div>
  );
};

export default Report;