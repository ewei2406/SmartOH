import { useParams } from "react-router-dom"
import Logout from "../Components/Logout"
import { useEffect, useRef, useState } from "react"
import UserIcon from "../Components/UserIcon"
import { OHService } from "../OHService"

const StudentRoomView = ({ currentData, setCurrentData, rooms }: any) => {

    // useEffect(() => { }, [rooms])

    const textRef = useRef(null)
    const [question, setQuestion] = useState("")
    const [edit, setEdit] = useState(false)
    const params = useParams()

    console.log(currentData, rooms)

    let queue = []
    if (rooms && rooms[currentData.roomID]) {
        queue = rooms[currentData.roomID].queue.filter((s: any) => s.beginHelpedByID === null)
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

    return (
        <div style={{ userSelect: 'none', width: 800 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>
                    Hi, {currentData.id || "unknown"}!
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ color: '#085f05' }}>● Connected</div>
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
                        TAs
                        <br />
                        <div style={{ display: 'flex', gap: -50, marginTop: '15px', marginLeft: '15px' }}>
                            {queue.slice(0, 5).map((t: any) => <UserIcon key={t.id} name={t.id} size={50} />)}
                            {queue.length > 5 && <div style={{
                                borderRadius: 50, border: '2px solid var(--dark)', padding: '0 10px',
                                height: 50, fontWeight: 800, backgroundColor: 'var(--medium)', minWidth: 30,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                            }}
                            >{queue.length - 5}+</div>}
                        </div>
                    </h2>

                    <h2>Position: <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{myPosition}</span>
                        <br />
                        <i style={{ color: 'var(--medium)', fontSize: '0.8em' }}>
                            Estimated Wait Time is
                            <span style={{ fontWeight: 800, color: 'var(--accent)' }}> {Math.round(rooms && (rooms[currentData.roomID].avgStudentTime * (myPosition) / 6) / 10)} min</span>
                        </i>
                    </h2>

                    <h2>
                        Your Question
                    </h2>

                    <textarea 
                        style={{ width: '100%', boxSizing: 'border-box', height: 200, resize: 'none', marginBottom: 15, backgroundColor: 'var(--dark)' }}
                        disabled={!edit}
                        ref={textRef}
                        value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter Your Question..." />

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
                        {!edit && <button onClick={() => { setEdit(true) }} style={{ width: '100%' }}>Edit</button>}
                        {edit && <button style={{ filter: 'hue-rotate(90deg)', width: '50%' }} onClick={e => cancelQuestion() }>Cancel</button>}
                        {edit && <button style={{ width: '50%' }} disabled={!question || question === ""} onClick={e => saveQuestion()}>Save</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentRoomView