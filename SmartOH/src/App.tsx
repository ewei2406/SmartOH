// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import studentData from './studentData';
import "./App.css"
import { io, Socket } from "socket.io-client";
import TAAllRoomsView from './Pages/TAAllRoomsView';
import StudentAllRoomsView from './Pages/StudentAllRoomsView';
// @ts-ignore
import TARoomView from './Pages/TARoomView';
import StudentRoomView from './Pages/StudentRoomView';

const App: React.FC = () => {

    const [currentData, setCurrentData] = useState({
        id: '',
        roomID: '',
        loggedIn: false,
        userType: 'student'
    });

    const [rooms, setRooms] = useState<any>()
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const s = io("http://localhost:3000")
        setSocket(s)
        s.on('changed', m =>  {
            setRooms(m)
        })
        console.log("Connected to the socket")
    }, [])

    const handleLogin = () => {
        if (currentData.id === "") return;
        setCurrentData({
            ...currentData,
            loggedIn: true
        })
    };

    console.log(currentData, rooms)

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to={`/login`} />} />
                <Route path="/login" element={
                    currentData.loggedIn ?
                        <Navigate to={`/${currentData.userType}/rooms`} /> :
                        <Login currentData={currentData} setCurrentData={setCurrentData} handleLogin={handleLogin}
                        />} />
                <Route path="/ta/rooms" element={<TAAllRoomsView currentData={currentData} setCurrentData={setCurrentData} rooms={rooms}/>} />
                <Route path="/ta/rooms/:roomID" element={<TARoomView currentData={currentData} setCurrentData={setCurrentData} rooms={rooms}/>} />
                <Route path="/student/rooms" element={<StudentAllRoomsView currentData={currentData} setCurrentData={setCurrentData} rooms={rooms}/>} />
                <Route path="/student/rooms/:roomID" element={<StudentRoomView currentData={currentData} setCurrentData={setCurrentData} rooms={rooms}/>} />
            </Routes>
        </Router>
    );
};

export default App;