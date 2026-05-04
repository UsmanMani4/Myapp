import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';

const Report = () => {
  const [notesCount, setNotesCount] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [prayerStreak, setPrayerStreak] = useState(0);
  const [fastingDays, setFastingDays] = useState(0);
  const [monthlyBalance, setMonthlyBalance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const notesRes = await axios.get('http://127.0.0.1:8000/api/notes/');
      const tasksRes = await axios.get('http://127.0.0.1:8000/api/tasks/');
      const prayersRes = await axios.get('http://127.0.0.1:8000/api/prayers/');
      const fastingRes = await axios.get('http://127.0.0.1:8000/api/fasting/');
      const financeRes = await axios.get('http://127.0.0.1:8000/api/finance/');

      setNotesCount(notesRes.data.length);

      const completed = tasksRes.data.filter(t => t.is_completed).length;
      setTasksCompleted(completed);
      setTotalTasks(tasksRes.data.length);

      // Prayer Streak
      let streak = 0;
      const prayersByDate = {};
      prayersRes.data.forEach(p => prayersByDate[p.date] = p);
      
      let checkDate = new Date();
      // Check today first
      let todayStr = checkDate.toISOString().split('T')[0];
      let todayP = prayersByDate[todayStr];
      if (todayP && todayP.fajr && todayP.dhuhr && todayP.asr && todayP.maghrib && todayP.isha) {
          streak++;
      }
      
      // Check backwards from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        let dStr = checkDate.toISOString().split('T')[0];
        let p = prayersByDate[dStr];
        if (p && p.fajr && p.dhuhr && p.asr && p.maghrib && p.isha) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      setPrayerStreak(streak);

      // Month matching for fasting and finance
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Fasting Days
      let fastingCount = 0;
      fastingRes.data.forEach(f => {
          if (f.did_fast) {
              // f.date is YYYY-MM-DD
              // Need to handle timezone parsing safely. Split and create date is safer for exact month matching:
              const [y, m, d] = f.date.split('-');
              if (parseInt(m, 10) - 1 === currentMonth && parseInt(y, 10) === currentYear) {
                  fastingCount++;
              }
          }
      });
      setFastingDays(fastingCount);

      // Monthly Balance
      let balance = 0;
      financeRes.data.forEach(fin => {
          const [y, m, d] = fin.date.split('-');
          if (parseInt(m, 10) - 1 === currentMonth && parseInt(y, 10) === currentYear) {
              if (fin.type === 'income') {
                  balance += parseFloat(fin.amount);
              } else if (fin.type === 'expense') {
                  balance -= parseFloat(fin.amount);
              }
          }
      });
      setMonthlyBalance(balance);

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
        <div className="report-value">{prayerStreak} day{prayerStreak !== 1 ? 's' : ''} 🔥</div>
        <div className="report-subtext">Consecutive complete days</div>
      </div>

      <div className="report-card">
        <h3>Fasting This Month</h3>
        <div className="report-value">{fastingDays} day{fastingDays !== 1 ? 's' : ''}</div>
        <div className="report-subtext">Current month</div>
      </div>

      <div className="report-card">
        <h3>Monthly Balance</h3>
        <div className="report-value">${monthlyBalance.toFixed(2)}</div>
        <div className="report-subtext">Income vs Expenses</div>
      </div>

    </div>
  );
};

export default Report;