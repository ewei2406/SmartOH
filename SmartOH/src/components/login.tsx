// src/Login.tsx
import React, { useState } from 'react';


const Login = ({ currentData, setCurrentData, handleLogin }: { currentData: any, setCurrentData: any, handleLogin: any }) => {
    const setType = (type: string) => {
        setCurrentData({
            ...currentData,
            userType: type
        })
    }

    const setName = (name: string) => {
        setCurrentData({
            ...currentData,
            id: name
        })
    }

  return (
    <div>
      <h1>Login</h1>
          <button onClick={() => setType('student')}>I am a student</button>
          <button onClick={() => setType('ta')}>I am a TA</button>
      <input
        type="text"
        placeholder="Enter your name"
        value={currentData.id}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
