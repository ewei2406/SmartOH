import { useNavigate } from 'react-router-dom';
import { OHService } from '../OHService';

export const Logout = ({ currentData, setCurrentData }: any) => {
    const navigate = useNavigate();
    const logout = () => {
        navigate('/login');

        if (currentData.roomID) {
            if (currentData.userType === 'ta') {
                OHService.leaveAsTA(currentData.id, currentData.roomID)
            } else {
                OHService.leaveAsStudent(currentData.id, currentData.roomID)
            }
        }

        setCurrentData({
            ...currentData,
            id: null,
            roomID: null,
            // rooms: null,
            loggedIn: false,
            userType: 'student'
        })
    }

    if (!currentData.id) navigate('/login');

    return (
        <button onClick={logout}>
            Log Out
        </button>
    )
}

export default Logout