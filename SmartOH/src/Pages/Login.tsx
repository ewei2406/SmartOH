// src/Login.tsx
import React, { useState } from 'react';
import "./Login.css"

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

    const leftActive = currentData.userType === 'student'

    return (
        <div style={{ marginTop: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1>Login</h1>

            <div>

                <div style={{ display: 'flex' }}>
                    <div className={'tab ' + (leftActive ? 'active' : "")} onClick={() => setType('student')} >Student</div>
                    <div className={'tab ' + (!leftActive ? 'active' : "")} onClick={() => setType('ta')} >TA</div>
                </div>

                <div style={{ 
                    backgroundColor: 'var(--darker)', 
                    borderRadius: `${leftActive ? 0 : 10}px ${!leftActive ? 0 : 10}px 10px 10px`, 
                    border: '1px solid var(--accent)', 
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                    }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={currentData.id || ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <button onClick={handleLogin} disabled={currentData.id === '' || !currentData.id}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
