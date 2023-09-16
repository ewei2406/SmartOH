// src/Login.tsx
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState<string>('');

  const handleLogin = () => {
    if (name) {
      // Dummy code: Here you could send the name to an API, save to local storage, etc.
      console.log(`User ${name} is logged in.`);

      // Call the parent component's onLogin function to handle successful login
      onLogin(name);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
