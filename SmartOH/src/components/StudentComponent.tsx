// src/StudentComponent.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentComponent: React.FC = () => {
  const navigate = useNavigate();
  
  const goToQueue = (className: string) => {
    navigate(`/joinQueue/${className}`);
  };
  
  const classes = ['Math 101', 'History 201', 'Computer Science 301'];

  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Your Classes:</h3>
      <ul>
        {classes.map((className, index) => (
          <li key={index}>
            <button onClick={() => goToQueue(className)}>
              Go to {className} Office Hours Queue
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentComponent;