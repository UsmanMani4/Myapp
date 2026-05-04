<div align="center">

# ⚡ LifeOS
### *Your Life. Organized. Elevated.*

[![Made with Django](https://img.shields.io/badge/Backend-Django%20REST-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge)](#)

> **LifeOS** is a fully personalized, all-in-one daily productivity operating system built for one person — me. It tracks everything that matters: prayers, fasting, tasks, notes, finances, habits, and even Clash of Clans builder timers across multiple accounts. No subscriptions. No bloat. No third-party nonsense. Just pure, personal control.

---

</div>

## 🧠 Philosophy

Most productivity apps are built for the masses. LifeOS is built for **one life** ,which is mine. Every feature exists because I needed it. Every tab solves a real daily problem. This is not a SaaS product. This is a personal operating system, running locally, owned completely.

---

## ✨ Features

### 📋 Notes & Tasks
- Create, edit, pin, and delete notes with title + content
- Full task management with priority levels (High / Medium / Low)
- Due dates with overdue highlighting
- Real-time search and filter (All / Completed / Pending)
- Task completion counter and clear completed button

### 🕌 Prayer Tracker
- Daily 5-prayer checklist — Fajr, Dhuhr, Asr, Maghrib, Isha
- Auto-detects today's record and switches between POST and PATCH
- Integrated fasting tracker (Did I fast today?)
- Fasting note support

### 💰 Finance Manager
- Log daily income and expenses with category tagging
- Categories: Food, Transport, Bills, Savings, Other
- Today's summary and monthly balance overview
- Net balance displayed in green (positive) or red (negative)
- Full transaction history with delete support

### ✅ Habit Tracker
- Create custom daily habits
- Tick off habits as done throughout the day
- Live counter: "X of Y habits done today"
- Fresh slate every day

### ⚔️ Clash of Clans Builder Tracker
- Manage multiple CoC accounts in one place
- Track up to 6 builders per account (including B.O.B)
- Live countdown timers per builder (days, hours, minutes, seconds)
- Auto-detects when a builder becomes free
- Browser notification alert when a builder finishes
- 7-day timeline view across all accounts
- Free Builders Summary dashboard card

### 📊 Report & Analytics
- Productivity score based on task completion
- Real prayer streak counter (consecutive fully-completed days)
- Monthly fasting count
- Monthly income vs expense comparison
- All metrics calculated live from real data

### 🏠 Home Dashboard
- Daily snapshot of all modules in one view
- Recent notes and tasks preview
- CoC free builders summary card
- Live clock display

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, CSS3 |
| Backend | Django, Django REST Framework |
| Database | SQLite |
| Dev Environment | VS Code, Antigravity Agent |
| Future | Electron (Desktop App) |

---

## 📁 Project Structure

```
LifeOS/
├── backend/
│   ├── backend/          # Django project settings
│   ├── core/             # Main app
│   │   ├── models.py     # All data models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   └── manage.py
├── frontend/
│   ├── public/
│   └── src/
│       └── components/
│           ├── Home.js
│           ├── Navbar.js
│           ├── Notes.js
│           ├── Prayer.js
│           ├── HabitTracker.js
│           ├── Finance.js
│           ├── CoCTracker.js
│           └── Report.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/YOURUSERNAME/LifeOS.git
cd LifeOS
```

### 2. Start the Backend
```bash
cd backend
python -m venv lf
lf\scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs at → `http://localhost:8000`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at → `http://localhost:3000`

> ⚠️ **Both terminals must be running at the same time.**

---

## 🗺️ Roadmap

- [x] Notes & Task Management
- [x] Prayer & Fasting Tracker
- [x] Finance Manager
- [x] Habit Tracker
- [x] Clash of Clans Builder Timer
- [x] Report & Analytics Dashboard
- [ ] Prayer tab — full polish & Quran log
- [ ] Dhikr counter
- [ ] Dark / Light theme toggle
- [ ] Electron desktop app with system notifications
- [ ] Daily reminder notifications
- [ ] Weekly summary email/report

---

## 🔒 Privacy

This is a **private, personal application**. All data is stored locally on your machine via SQLite. No cloud. No tracking. No external data sharing of any kind.

---

## 👤 Author

**Built & maintained by one person, for one person.**

> *"LifeOS is not an app. It's a system. My system."*

---

<div align="center">

**@LifeOS Redemption Process**

*Built with purpose. Maintained with discipline.*

</div>
