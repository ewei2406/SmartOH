// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import studentData from './studentData';
import StudentComponent from './components/StudentComponent';
import TAComponent from './components/TAComponent';
import { OHService } from './service';
import { io, Socket } from "socket.io-client";
import JoinQueue from './components/JoinQueue';
import { Student } from '../../Student';

const App: React.FC = () => {

  const [currentData, setCurrentData] = useState<any>({
    id: null,
    roomID: null,
    rooms: null,
    isLoggedin: false
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
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

  const handleLogin = (name: string) => {
    setName(name);
    const student = studentData.find((student) => student.name === name);
    if (student) {
      setUserGroup(student.groups);
      setLoggedIn(true);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/ta/rooms" element={<div>Hello</div>} />
        <Route path="/ta/rooms/{roomID}" element={<div>Hello</div>} />
        <Route path="/student/rooms" element={<div>Hello</div>} />
        <Route path="/student/rooms/{roomID}" element={<div>Hello</div>} />
      </Routes>
    </Router>
  );
};

export default App;