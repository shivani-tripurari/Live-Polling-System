import React, {useEffect,useState} from 'react'
import { socket } from '../../socket/Socket.js'
import './index.css'

const Teacher = () => {

  const[question, setQuestion] = useState("");
  const[options, setOptions] = useState(["",""]);
  const[expectedStudents, setExpectedStudents] = useState(1); 
  const [polls, setPolls] = useState([]);

    // Send the question to students
  const sendQuestion = () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert("Please enter a question and fill all options.");
      return;
    }

    socket.emit('teacher:askQuestion', {
      question,
      options,
      expectedStudents: Number(expectedStudents),
    });

    // Clear form after sending
    setQuestion("");
    setOptions(["", ""]);
    setExpectedStudents(1);
  };

  // Setup socket listeners
  useEffect(() => {
    // Ask server for history
    socket.emit('teacher:getHistory');

    // On new result, append it
    socket.on('poll:results', (data) => {
      setPolls(prev => [...prev, data]);
    });

    // On full history, replace
    socket.on('poll:history', (history) => {
      setPolls(history);
    });

    // Cleanup
    return () => {
      socket.off('poll:results');
      socket.off('poll:history');
    };
  }, []);


  return (
    <div className='container'>
      <h1>Let's get started</h1>
      <p>you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
      <div class="question">
      <label htmlFor="question" className="block mb-1 font-semibold">
        Enter your question
      </label>
      <textarea
        id="question"
        placeholder="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full border rounded p-2"
      />
      </div>

      <div class="options">
      {options.map((opt,idx) => (
        <input 
          key={idx}
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={e => {
          const newOptions = [...options];
          newOptions[idx] = e.target.value;
          setOptions(newOptions);
        }}
        />
      ))}
      <button onClick={()=> setOptions([...options, ""])} >Add option</button>
      </div>
      <br/>
      <div class='ask'>
      <label htmlFor="expectedStudents" className="block mb-1 font-semibold">
        Number of students participating
      </label>
      <input 
        type="number"
        placeholder="Expected students"
        value={expectedStudents}
        onChange={e => setExpectedStudents(e.target.value)}
      />

      </div>
      <button class="send" onClick={sendQuestion}>Send question</button>
<h1>View poll history</h1>
{polls.map((results, index) => (
  <div className="result-container" key={index}>
    <h2>{results.question}</h2>
    {results.options.map((opt, idx) => {
      const count = Object.values(results.answers).filter(a => a === opt).length;
      const total = Object.keys(results.answers).length;
      const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
      return (
        <div className="options" key={idx}>
          <div className="progress-bar" style={{ width: `${percentage}%` }} />
          <strong>{opt}</strong>
          <span>{percentage}% ({count} votes)</span>
        </div>
      );
    })}
  </div>
))}


    </div>
  )
}

export default Teacher
