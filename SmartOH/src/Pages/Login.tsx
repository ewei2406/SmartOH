// src/Login.tsx
import React, { useState } from 'react';
import "./Login.css"
import { FaGraduationCap, FaAppleWhole, FaCircleArrowRight } from 'react-icons/fa6'

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
        <div style={{ marginTop: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '5em', margin: '30px 0' }}>Smart<span style={{ color: 'var(--accent)' }}>OH</span></h1>
            
            <br /><br /><br />
            <br />
            <div>

                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', gap: 5 }} className={'tab ' + (leftActive ? 'active' : "inactive")} onClick={() => setType('student')} ><FaGraduationCap /> Student</div>
                    <div style={{ display: 'flex', gap: 5 }} className={'tab ' + (!leftActive ? 'active' : "inactive")} onClick={() => setType('ta')} ><FaAppleWhole /> TA</div>
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
                        style={{ width: 250 }}
                        placeholder="Username"
                        value={currentData.id || ""}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* <input
                        style={{ width: 250 }}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /> */}
                    <button style={{ marginTop: '10px', display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center' }} onClick={handleLogin} disabled={currentData.id === '' || !currentData.id}><FaCircleArrowRight/> Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
