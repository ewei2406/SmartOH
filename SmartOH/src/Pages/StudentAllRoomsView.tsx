import { useState } from "react"
import Logout from "../Components/Logout"
import RoomCard from "../Components/RoomCard"
import { OHService } from "../OHService"
import Popup from "../Components/Popup"
import "./CardScroller.css"
import { useNavigate } from "react-router-dom"
import UserIcon from "../Components/UserIcon"
import Logo from "../Components/Logo"

import { FaCircleXmark, FaCircleCheck } from 'react-icons/fa6'

const StudentAllRoomsView = ({ currentData, setCurrentData, rooms }: any) => {

    const navigate = useNavigate()

    const [question, setQuestion] = useState("")
    const [joiningRoom, setJoiningRoom] = useState("")
    const [roomData, setRoomData] = useState<any>()
    const [showPopup, setShowPopup] = useState(false)
    const [filter, setFilter] = useState<string[]>([])

    const joinRoom = () => {
        OHService.joinAsStudent(currentData.id, joiningRoom, question)
        navigate('/student/rooms/' + joiningRoom)
        setCurrentData({
            ...currentData,
            roomID: joiningRoom
        })
    }

    const popupContent = <div className="card" style={{ padding: 30, boxShadow: '0 0 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ fontWeight: 800, fontSize: '1.5em' }}>Join "{joiningRoom}"</div>
            <div style={{ color: 'var(--light)' }}>{roomData && roomData.class}</div>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: 'var(--light)', width: '50px' }}>TAs</span>
            {<div style={{ display: 'flex', gap: -50 }}>
                {roomData && roomData.TAs.slice(0, 10).map((t: any) => <UserIcon key={t} name={t} size={30} />)}
                {roomData && roomData.TAs.length > 10 && <div style={{
                    borderRadius: 30, border: '2px solid var(--dark)', padding: '0 10px',
                    height: 30, fontWeight: 800, backgroundColor: 'var(--medium)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                }}
                >{roomData && roomData.TAs.length - 10}+</div>}
            </div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: 'var(--light)', width: '50px' }}>Queue</span>
            <div style={{ display: 'flex', gap: -50 }}>
                {roomData && roomData.queue.slice(0, 10).map((t: any) => <UserIcon key={t.id} name={t.id} size={30} />)}
                {roomData && roomData.queue.length > 10 && <div style={{
                    borderRadius: 30, border: '2px solid var(--dark)', padding: '0 10px',
                    height: 30, fontWeight: 800, backgroundColor: 'var(--medium)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                }}
                >{roomData && roomData.queue.length - 10}+</div>}
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--light)' }}>
            <div style={{ fontWeight: 800, color: 'var(--light)', width: '50px', whiteSpace: 'nowrap' }}>Avg. time / student</div>
            <div style={{ fontSize: '0.75em' }}>
                <span style={{ fontSize: '1.5em', fontWeight: 800 }}>{roomData && Math.round(roomData.avgStudentTime / 6) / 10} min</span>  <br />
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--light)' }}>
            <div style={{ fontWeight: 800, color: 'var(--light)', width: '50px', whiteSpace: 'nowrap' }}>Estimated wait time</div>
            <div style={{ fontSize: '0.75em' }}>
                <span style={{ fontSize: '1.5em', fontWeight: 800 }}>{roomData && Math.round(roomData.avgStudentTime * roomData.queue.length / 6) / 10} min</span>  <br />
            </div>
        </div>

        <br />

        <textarea style={{ width: 400, height: 200, resize: 'none' }} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter Your Question..." />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
            <button style={{ filter: 'hue-rotate(90deg)', width: '50%' }} onClick={() => { setJoiningRoom(""); setShowPopup(false) }}><div className="withIcon center"><FaCircleXmark/> Cancel</div></button>
            <button style={{ width: '50%' }} disabled={!question || question === ""} onClick={e => joinRoom()}><div className="withIcon center"><FaCircleCheck/> Join</div></button>
        </div>
    </div>

    let keys;
    if (rooms) {
        if (filter.length > 0) {
            keys = Object.keys(rooms).filter((k: string) => filter.includes(rooms[k].class))
        } else {
            keys = Object.keys(rooms)
        }
    }

    const toggleFilter = (f: string) => {
        if (filter.includes(f)) setFilter(filter.filter(i => i !== f))
        else setFilter([...filter, f])
    }

    return <div style={{ userSelect: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            
            <Logo />

            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ color: '#085f05' }}>● Connected</div>
                <Logout currentData={currentData} setCurrentData={setCurrentData} />
            </div>
        </div>
        <h1>
            👋 Hi, {currentData.id || "unknown"}!
        </h1>

        <div>
            <h2>
                Your Classes
            </h2>
            <div style={{ display: 'flex', gap: 10 }}>
                {["CS 1000", "CS 2000", "CS 9999"].map((m: string, i: number) => <div
                    className="card" key={m}
                    style={{
                        padding: 10, cursor: 'pointer',
                        borderColor: filter.includes(m) ? 'var(--accent)' : 'var(--medium)',
                        color: filter.includes(m) ? 'var(--accent)' : 'inherit',
                        backgroundColor: filter.includes(m) ? 'var(--dimAccent)' : 'var(--dark)',
                    }}
                    onClick={e => toggleFilter(m)}
                >

                    {m} <br /> <span style={{ color: 'var(--light)', fontSize: '0.75em' }}>Section 00{((i + 3) % 3) + 1}</span>
                </div>)}
            </div>
        </div>

        <br />

        <div>
            <h2>
                Active Office Hours
            </h2>

            <div className="cardScroller">
                {rooms && keys && keys.map((k) =>
                    <RoomCard message={"Join Queue"} disable={showPopup}
                        name={k} key={k} room={rooms[k]} subtitle={<div style={{ fontSize: '0.75em' }}>
                            <span style={{ fontSize: '1.5em', fontWeight: 800 }}>{Math.round(rooms[k].avgStudentTime * rooms[k].queue.length / 6) / 10} min</span>  <br />
                            est. wait time
                        </div>}
                        joinRoom={(m: string) => { setShowPopup(true); setJoiningRoom(m); setRoomData(rooms[k]); }} />
                )}
            </div>
        </div>

        <Popup content={popupContent} showPopup={showPopup} />
    </div>
}

export default StudentAllRoomsView