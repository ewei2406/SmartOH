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
        hello world TA view
        <br />

        {rooms && Object.keys(rooms).map((k) => 
            <RoomCard name={k} key={k} room={rooms[k]} joinRoom={joinRoom}/>
        )}

        <Logout currentData={currentData} setCurrentData={setCurrentData}/>
    </div>
}

export default TAAllRoomsView