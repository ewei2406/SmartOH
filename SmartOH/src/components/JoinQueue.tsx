// src/JoinQueue.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OHService } from '../service';

const JoinQueue: React.FC = () => {
  const { className } = useParams<{ className: string }>();
  const [question, setQuestion] = useState('');

  const handleEnterQueue = () => {
    // Send the question to your backend or handle it according to your needs

    alert(`Entered the queue for ${className} with question: ${question}`);
  };

  return (
    <div>
      <h2>Join the Office Hours Queue for {className}</h2>
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleEnterQueue}>Enter Queue</button>
    </div>
  );
};

export default JoinQueue;