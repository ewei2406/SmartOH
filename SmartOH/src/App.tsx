// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import studentData from './studentData';
import { OHService } from './service';
import { io, Socket } from "socket.io-client";

const App: React.FC = () => {

  const [currentData, setCurrentData] = useState<any>({
    id: null,
    roomID: null,
    rooms: null,
    loggedIn: false,
    userType: 'student'
  });

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    console.log("123")
    setSocket(io("http://localhost:3000"))
    if (!socket) return;
    socket.on('connect', () => {
      console.log("Connected")
    })

    socket.on('changed', m => console.log(m))
    OHService.subscribe()
    console.log("subscripted")
  }, [])

  const handleLogin = () => {
    const student = studentData.find((student) => student.name === currentData.id);
    if (student) {
       setCurrentData({
        ...currentData,
        loggedIn: true
       })
    }
  };

  console.log(currentData)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={`/login`} />}/>
        <Route path="/login" element={
          currentData.loggedIn ? 
            <Navigate to={`/${currentData.userType}/rooms`} /> : 
            <Login currentData={currentData} setCurrentData={setCurrentData} handleLogin={handleLogin}
            />} />
        <Route path="/ta/rooms" element={<div>Hello</div>} />
        <Route path="/ta/rooms/{roomID}" element={<div>Hello</div>} />
        <Route path="/student/rooms" element={<div>Hello</div>} />
        <Route path="/student/rooms/{roomID}" element={<div>Hello</div>} />
      </Routes>
    </Router>
  );
};

export default App;