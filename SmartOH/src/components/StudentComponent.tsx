// src/StudentComponent.tsx
import React from 'react';

const StudentComponent: React.FC = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Your Classes:</h3>
      <ul>
        <li>Math 101</li>
        <li>History 201</li>
        <li>Computer Science 301</li>
      </ul>
    </div>
  );
};

export default StudentComponent;
