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

    const [password, setPassword] = useState("")

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
                    backgroundColor: 'var(--dark)', 
                    borderRadius: `${leftActive ? 0 : 10}px ${!leftActive ? 0 : 10}px 10px 10px`, 
                    border: '1px solid var(--medium)', 
                    padding: '25px',
                    display: 'flex',
                    paddingTop: 40,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '15px'
                    }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={currentData.id || ""}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        style={{ width: 250 }}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button style={{ marginTop: '20px' }} onClick={handleLogin} disabled={currentData.id === '' || !currentData.id}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
