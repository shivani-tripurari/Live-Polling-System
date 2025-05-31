import React, {useEffect, useState} from 'react';
import { socket } from '../../socket/Socket.js';
import './index.css';


const Student = () => {

  const[name, setName] = useState(sessionStorage.getItem('studentName'));
  const [inputName, setInputName] = useState('');
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(()=>{
    socket.on('poll:newQuestion', (data) => {
      console.log("Recieved new question from server");
      setQuestion(data);
      setSelected("");
      setResults(null);
      setTimer(60);
    });
    socket.on("poll:results", (data)=>{
      console.log("Recieved poll results");
      setResults(data);
      console.log("data question",data.question);
      console.log("data options",data.options);
      console.log("data answer",data.answer);
      console.log("data ", data);
      setQuestion(null);
    })
  },[]);

  useEffect(()=>{
    if(question && timer > 0){
      const interval = setInterval(()=>{
        setTimer(t=>t-1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if(question && timer === 0){
      socket.emit('student:timeout', {name});
      setQuestion(null);
    }
  },[timer, question, name]);

  const handleSubmit = () => {
    socket.emit('student:submitAnswer', {name, answer: selected});
    setQuestion(null);
  };

  console.log("results : ", results);

  if(!name){
    return(
      <div class="studentName">
        <h1>Let’s Get Started</h1>
        <p> If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates</p>
        <input value={inputName} onChange={e => setInputName(e.target.value)} />
        <button onClick={() => {
          sessionStorage.setItem('studentName', inputName);
          setName(inputName);
        }}>Start</button>
      </div>
    );
  }

  return (
    <div class="questionArea">
      <h1>{name}, wait for the teacher to ask question</h1>
      {question ? (
        <div>
          <h3>{question.question}</h3>
          {question.options.map((opt, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                {opt}
              </label>
            </div>
          ))}
          <p>Time remaining: {timer}s</p>
          <button onClick={handleSubmit} disabled={!selected}>Submit Answer</button>
        </div>
      ) : results && results.options ? (
        <div>
          <h2>{results.question}</h2>
          {results.options.map((opt, idx) => {
            const count = Object.values(results.answers).filter(a => a === opt).length;
            const total = Object.keys(results.answers).length;
            const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
             <div className="options" key={idx}>
              <div
                className="progress-bar"
                style={{ width: `${percentage}%` }}
              />
              <strong>{opt}</strong>
              <span>{percentage}% ({count} votes)</span>
            </div>
            );
          })}
        </div>
      ) : (
        <p>Waiting for a question...</p>
      )}
    </div>
  )
}

export default Student
