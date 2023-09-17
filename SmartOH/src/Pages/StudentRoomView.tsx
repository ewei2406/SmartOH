import { useParams } from "react-router-dom"
import Logout from "../Components/Logout"

const StudentRoomView = ({ currentData, setCurrentData, rooms }: any) => {
    const params = useParams()

    console.log(params)

    return(
        <div style={{ userSelect: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>
                    Hi, {currentData.id || "unknown"}!
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ color: '#085f05' }}>● Connected</div>
                    <Logout currentData={currentData} setCurrentData={setCurrentData} />
                </div>
            </div>
        </div>
    )
}

export default StudentRoomView