// src/App.tsx
import React, { useState } from 'react';
import Login from './components/Login';
import studentData from './StudentData.tsx';
import StudentComponent from './components/StudentComponent';
import TAComponent from './components/TAComponent';

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [userGroup, setUserGroup] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLogin = (name: string) => {
    setName(name);

    const student = studentData.find(student => student.name === name);
    if (student) {
      setUserGroup(student.groups);
      setLoggedIn(true);
    }

    // setLoggedIn(true);
  };

  if (loggedIn) {
    return (
      <div>
        <h1>Welcome, {name}!</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {userGroup.includes('TA') && <TAComponent />}
          {userGroup.includes('Student') && <StudentComponent />}
        </div>
      </div>
    );
  }

  return <Login onLogin={handleLogin} />;
};

export default App;