import { useNavigate } from "react-router-dom"
import Logout from "../Components/Logout"
import RoomCard from "../Components/RoomCard"
import { OHService } from "../OHService"

const TAAllRoomsView = ({ currentData, setCurrentData, rooms }: any) => {

    const navigate = useNavigate()

    const joinRoom = (roomID: string) => {
        console.log(currentData.id)
        OHService.joinAsTA(currentData.id, roomID)
        navigate('/ta/rooms/' + roomID)
    }

    return <div style={{ userSelect: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>
                Hi, {currentData.id || "unknown"}!
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ color: '#085f05' }}>● Connected</div>
                <Logout currentData={currentData} setCurrentData={setCurrentData} />
            </div>
        </div>
        <div>
            <h2>
                Your Active Rooms
            </h2>

            <div className="cardScroller">
                {rooms && Object.keys(rooms).map((k) =>
                    <RoomCard message={"Join as TA"}
                        name={k} key={k} room={rooms[k]} subtitle={<div style={{ fontSize: '0.75em' }}>
                            <span style={{ fontSize: '1.5em', fontWeight: 800 }}>{Math.round(rooms[k].avgStudentTime / 6) / 10} min</span>  <br />
                            Avg. wait time
                        </div>}
                        joinRoom={joinRoom} />
                )}
            </div>
        </div>
    </div>
}

export default TAAllRoomsView