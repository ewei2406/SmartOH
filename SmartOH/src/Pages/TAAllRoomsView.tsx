import Logout from "../Components/Logout"
import RoomCard from "../Components/RoomCard"
import { OHService } from "../OHService"

const TAAllRoomsView = ({ currentData, setCurrentData, rooms }: any) => {

    const joinRoom = (roomID: string) => {
        console.log(currentData.id)
        OHService.joinAsTA(currentData.id, roomID)
        setCurrentData({
            ...currentData,
            roomID: roomID
        })
    }

    console.log(rooms)

    return <div>
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
                Your Active Office Hours
            </h2>
        <br />

        {rooms && Object.keys(rooms).map((k) => 
            <RoomCard name={k} key={k} room={rooms[k]} joinRoom={joinRoom}/>
        )}

        <Logout currentData={currentData} setCurrentData={setCurrentData}/>
    </div>
    </div>
}

export default TAAllRoomsView