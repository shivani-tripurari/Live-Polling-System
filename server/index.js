const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors()); // allow requests from any origin

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory store 
let currentQuestion = null;
let answers = {};
let totalStudents = 0;
let pollHistory = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current question if it exists
  if (currentQuestion) {
    socket.emit('poll:newQuestion', currentQuestion);
  }

  // Teacher sends a new poll
  socket.on('teacher:askQuestion', ({ question, options, expectedStudents }) => {
    if (!currentQuestion) {
      currentQuestion = { question, options };
      totalStudents = expectedStudents;
      answers = {};
      io.emit('poll:newQuestion', currentQuestion); // broadcast to all
      console.log('Question asked:', question);
    }
  });

  // Student submits answer
  socket.on('student:submitAnswer', ({ name, answer }) => {
    answers[name] = answer;

if (Object.keys(answers).length >= totalStudents) {
  const pollResult = {
    question: currentQuestion.question,
    options: currentQuestion.options,
    answers: { ...answers },
    timestamp: Date.now(),
  };

  pollHistory.push(pollResult); 

  io.emit('poll:results', pollResult);
  io.emit('poll:history', pollHistory); 
  currentQuestion = null;
}


  });

  // Student timeout
  socket.on('student:timeout', ({ name }) => {
    if (!answers[name]) {
      answers[name] = 'No Answer';
    }
if (Object.keys(answers).length >= totalStudents) {
  const pollResult = {
    question: currentQuestion.question,
    options: currentQuestion.options,
    answers: { ...answers },
    timestamp: Date.now(),
  };

  pollHistory.push(pollResult); 

  io.emit('poll:results', pollResult);
  io.emit('poll:history', pollHistory); 
  currentQuestion = null;
}


  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


server.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
