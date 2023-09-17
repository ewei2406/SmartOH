import { useNavigate } from 'react-router-dom';
import { OHService } from '../OHService';
import { FaCircleArrowLeft } from 'react-icons/fa6'

export const Logout = ({ currentData, setCurrentData }: any) => {
    const navigate = useNavigate();
    const logout = () => {
        
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

        navigate('/login');
    }

    if (!currentData.id) navigate('/login');

    return (
        <button onClick={logout} className='withIcon' style={{ flexGrow: '0' , display: 'block', filter: 'hue-rotate(90deg)' }}>
            <div className='withIcon'><FaCircleArrowLeft/> Log Out</div>
        </button>
    )
}

export default Logout