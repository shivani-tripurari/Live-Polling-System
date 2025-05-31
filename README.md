# 📊 Live Polling System

A real-time polling system built with **React** (frontend) and **Express + Socket.IO** (backend) to simulate live Q&A interaction between **Teachers** and **Students**.

---

## 👥 Personas

### 👨‍🏫 Teacher

The Teacher can:
- ✅ Create a new poll (a question with multiple options)
- 📈 View live polling results in real time
- ❗ Only ask a new question if:
  - No active question exists, **or**
  - All students have submitted their answers

---

### 👨‍🎓 Student

The Student can:
- 🔤 Enter their **name** when visiting the app for the first time in a tab
  - Name is **unique to a tab**
  - If you **refresh**, the name is remembered
  - If you **open a new tab**, you act as a new student
- 📝 See and answer the question when asked by the teacher
- 📊 View **live polling results** after submitting the answer
- ⏲️ Has a **maximum of 60 seconds** to respond
  - After timeout, the results are shown automatically

---

## ⚙️ Tech Stack

| Layer     | Technology     |
|-----------|----------------|
| Frontend  | React.js       |
| Backend   | Express.js     |
| Realtime  | Socket.IO      |

---

## 🚀 Deployed Site : https://live-polling-system-nine.vercel.app/
