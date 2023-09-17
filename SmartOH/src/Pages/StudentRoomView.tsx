import { useNavigate, useParams } from "react-router-dom"
import Logout from "../Components/Logout"
import { useEffect, useRef, useState } from "react"
import UserIcon from "../Components/UserIcon"
import { OHService } from "../OHService"
import Logo from "../Components/Logo"
import { FaPen } from 'react-icons/fa6'
import { FaUserGroup, FaClock, FaCircleQuestion, FaBolt } from 'react-icons/fa6'
import { FaCircleXmark, FaCircleCheck, FaCircleArrowLeft } from 'react-icons/fa6'
import Popup from "../Components/Popup"
import { GridLoader } from "react-spinners"

const StudentRoomView = ({ currentData, setCurrentData, rooms }: any) => {

    // useEffect(() => { }, [rooms])

    const textRef = useRef(null)
    const [question, setQuestion] = useState("")
    const [edit, setEdit] = useState(false)

    const params = useParams()

    console.log(currentData, rooms)

    let queue = []
    let TAs = []

    if (rooms && rooms[currentData.roomID]) {
        queue = rooms[currentData.roomID].queue.filter((s: any) => s.beginHelpedByID === "")
        TAs = rooms[currentData.roomID].TAs
    }


    console.log(queue)

    const loadQuestion = () => {
        if (rooms && rooms[currentData.roomID]) {
            const s = rooms[currentData.roomID].queue.find((k: any) => k.id === currentData.id)
            if (s) setQuestion(s.question)
        }
    }

    const saveQuestion = () => {
        OHService.updateQuestion(currentData.id, currentData.roomID, question)
        setEdit(false)
    }

    const cancelQuestion = () => {
        loadQuestion()
        setEdit(false)
    }

    useEffect(() => {
        loadQuestion()
    }, [rooms])

    const myPosition = queue.findIndex((s: any) => s.id === currentData.id) + 1 

    const navigate = useNavigate()
    const leave = () => {
        OHService.leaveAsStudent(currentData.id, currentData.roomID)
        navigate('/student/rooms')
    }

    const rejoin = () => {
        OHService.moveStudentAsTA(-1, currentData.roomID, currentData.id, true)
    }

    const helpedById = rooms &&
        rooms[currentData.roomID] &&
        rooms[currentData.roomID].queue.find((p: any) => p.id === currentData.id) &&
        rooms[currentData.roomID].queue.find((p: any) => p.id === currentData.id).beginHelpedByID

    console.log(helpedById)
    const showPopup = helpedById !== ""

    const [loading, setLoading] = useState(false)
    const [helpText, setHelpText] = useState("Can't get to a TA fast enough? Get helped by the AI TA!")

    const generate = () => {
        setLoading(true)
        OHService.getHelp(question, (data: any) => {
            setHelpText(data.reply)
            setLoading(false)
        })
    }
    
    return (
        <div style={{ userSelect: 'none', width: 800 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Logo/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ color: '#085f05' }}>● Connected</div>
                    <button onClick={() => leave()} className="withIcon" style={{ filter: 'hue-rotate(135deg)' }}><FaCircleArrowLeft /> Leave Queue</button>
                    <Logout currentData={currentData} setCurrentData={setCurrentData} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
                <div style={{ width: '100%', gap: 15, display: 'flex', flexDirection: 'column' }}>
                    <h2>
                        {currentData.roomID} Queue
                        <br />
                        <i style={{ color: 'var(--medium)', fontSize: '0.8em' }}>{rooms && rooms[currentData.roomID] && rooms[currentData.roomID].class}</i>
                    </h2>
                    {queue.map((q: any, i: number) => <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <span style={{ color: 'var(--light)', fontWeight: 800, width: 30, textAlign: 'right' }}>{i + 1}.</span>
                            <div className="card" style={{ padding: 15, display: 'flex', gap: 10, alignItems: 'center', flexGrow: 0, width: 320, 
                                borderColor: q.id === currentData.id ? 'var(--accent)' : 'var(--medium)',
                            backgroundColor: q.id === currentData.id ? 'var(--dimAccent)' : 'var(--dark)',
                        }}>
                                <div></div>
                            <UserIcon name={q.id} size={40} highlight={q.id === currentData.id}/>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: 3 }}>
                                    <div style={{ fontWeight: 800, flexShrink: 0 }}>{q.id}</div>
                                    <i style={{ color: 'var(--light)', fontSize: '0.8em', wordBreak: 'break-all' }}>{q.question}</i>
                                </div>
                            </div>
                        </div>)}
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    <h2>
                        <div className="withIcon"> <FaUserGroup/> TAs</div>
                        <div style={{ display: 'flex', gap: -50, marginTop: '15px', marginLeft: '15px' }}>
                            {TAs.slice(0, 5).map((t: any) => <UserIcon key={t} name={t} size={50} />)}
                            {TAs.length > 5 && <div style={{
                                borderRadius: 50, border: '2px solid var(--dark)', padding: '0 10px',
                                height: 50, fontWeight: 800, backgroundColor: 'var(--medium)', minWidth: 30,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                            }}
                            >{TAs.length - 5}+</div>}
                        </div>
                    </h2>

                    <h2><div className="withIcon" style={{ marginBottom: 10}}><FaClock/> Position: <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{myPosition}</span></div>
                        <i style={{ color: 'var(--medium)', fontSize: '0.8em', display: 'flex', alignItems: 'center', gap: 7 }}>
                            Estimated Wait Time is
                            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 800, color: 'var(--accent)' }}> <FaBolt style={{ display: 'block' }}/> {Math.round(rooms && rooms[currentData.roomID] && (rooms[currentData.roomID].avgStudentTime * (myPosition) / 6) / 10)} min</span>
                        </i>
                    </h2>

                    <div style={{ marginBottom: 20}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: '10px 0px'}} className="withIcon"><FaBolt /> AI TA</h2>
                            <button style={{ display: 'flex' }} onClick={() => generate()} >{loading ? <GridLoader color="var(--accent)" size={4} margin={0} speedMultiplier={2} /> : <FaBolt />}</button>
                        </div>
                        <div style={{ width: '100%', position: 'relative', color: loading ? 'var(--light)' : 'var(--light)' }}>
                            <div style={{ filter: loading ? 'blur(5px)' : 'none', fontSize: '1em', display: 'flex', flexDirection: 'column', gap: 4 }}>{helpText.split("\n").map(c => <div>{c}</div>)}</div>
                            <div className="withIcon" style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', position: 'absolute', color: 'var(--accent)', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto' }}>
                                <GridLoader color="var(--accent)" size={7} margin={0} speedMultiplier={2} /> Asking the AI TA for help...
                            </div>
                        </div>
                    </div>

                    <h2 className="withIcon">
                        <FaCircleQuestion/> Your Question
                    </h2>

                    <textarea 
                        style={{ width: '100%', boxSizing: 'border-box', height: 200, resize: 'none', marginBottom: 15, backgroundColor: 'var(--dark)' }}
                        disabled={!edit}
                        ref={textRef}
                        value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter Your Question..." />

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
                        {!edit && <button onClick={() => { setEdit(true) }} style={{ width: '100%' }}><div className="withIcon center"><FaPen/>Edit</div></button>}
                        {edit && <button style={{ filter: 'hue-rotate(90deg)', width: '50%' }} onClick={e => cancelQuestion()}><div className="withIcon center"><FaCircleXmark/>Cancel</div></button>}
                        {edit && <button style={{ width: '50%' }} disabled={!question || question === ""} onClick={e => saveQuestion()}><div className="withIcon center"><FaCircleCheck/>Save</div></button>}
                    </div>
                    <br />
                </div>
            </div>
                <Popup showPopup={showPopup} content={
                    <div className="card" style={{ padding: '35px' }}>
                        <div style={{ fontSize: '2em', fontWeight: 800, textAlign: 'center' }}>You are being helped by <br /> {helpedById || "Someone"}</div>
                        <br /> <br />
                        <div style={{display: 'flex', gap: 20 }}>
                        <div style={{ width: '50%' }}><button style={{ filter: 'hue-rotate(45deg)', width: '100%' }} onClick={e => leave()}><div className="withIcon center"><FaCircleArrowLeft />All done!</div></button></div>
                        <div style={{ width: '50%' }}><button style={{ filter: 'hue-rotate(90deg)', width: '100%' }} onClick={e => rejoin()}><div className="withIcon center"><FaCircleArrowLeft />Rejoin Queue</div></button></div>
                        </div>
                
                    </div>
                }/>
        </div>
    )
}

export default StudentRoomView