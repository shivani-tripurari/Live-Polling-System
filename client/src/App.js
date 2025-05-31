import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Student from "./components/student/Student.jsx";
import Teacher from "./components/teacher/Teacher.jsx";
import './App.css';


function App() {

 return (
    <Router>
      <Routes>
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        <Route path="/" element={
         <div class="parent">
  <h1>
    Welcome to the <span>Live Polling System</span>
  </h1>
  <div class="user">
          <div class="info">
            <h3><a class="linkClass" href="/student">I am a Student</a></h3>
            <p>Participate in polls and analyze your score</p>
          </div>
          <div class="info">
            <h3><a class="linkClass" href="/teacher">I am a Teacher</a></h3>
            <p>Conduct polls and analyze your students score</p>
          </div>
  </div>
</div>

      } />
      </Routes>
    </Router>
  );
}

export default App;
