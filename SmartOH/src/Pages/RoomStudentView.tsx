import Logout from "../Components/Logout"

const RoomStudentView = ({ currentData, setCurrentData }: any) => {
    return <div>
        hello world Student view
        <Logout currentData={currentData} setCurrentData={setCurrentData} />
    </div>
}

export default RoomStudentView