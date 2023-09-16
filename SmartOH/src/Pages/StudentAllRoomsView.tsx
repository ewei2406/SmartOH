import { useState } from "react"
import Logout from "../Components/Logout"
import RoomCard from "../Components/RoomCard"
import { OHService } from "../OHService"
import Popup from "../Components/Popup"

const StudentAllRoomsView = ({ currentData, setCurrentData, rooms }: any) => {

    const [question, setQuestion] = useState("")
    const [joiningRoom, setJoiningRoom] = useState("")
    const [showPopup, setShowPopup] = useState(false)

    const joinRoom = () => {
        OHService.joinAsStudent(currentData.id, joiningRoom, question)
    }

    const popupContent = <div>
                Question: <input value={question} onChange={e => setQuestion(e.target.value)}/>
                <button disabled={!question || question === ""} onClick={e => joinRoom()}>Join</button>
                <button onClick={() => { setJoiningRoom(""); setShowPopup(false) }}>Cancel</button>
            </div>

    console.log(rooms)

    return <div>
        hello world Student view
        <br />

        {rooms && Object.keys(rooms).map((k) =>
            <RoomCard disable={showPopup} name={k} key={k} room={rooms[k]} joinRoom={(m: string) => { setShowPopup(true); setJoiningRoom(m) }} />
        )}

        <Logout currentData={currentData} setCurrentData={setCurrentData} />
        <Popup content={popupContent} showPopup={showPopup}/>
    </div>
}

export default StudentAllRoomsView