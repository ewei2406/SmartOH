// src/TAComponent.tsx
import React from 'react';
import {useNavigate} from 'react-router-dom';

const TAComponent: React.FC = () => {
  const navigate = useNavigate()
const newQueue = (className: string) =>  {
  navigate(`queue/${className}`)
}
const classes = ['Math 101', 'History 201', 'Computer Science 301'];

  return (
    <div>
      <h2>TA Dashboard</h2>
      <h3>Classes you assist:</h3>
      <ul>
        {classes.map((className, index) => (
            <li key={index}>
              <button onClick={() => newQueue(className)}>
                Go to {className} Office Hours Queue
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TAComponent;
