import { useNavigate } from 'react-router-dom';

export const Logout = ({ setCurrentData }: any) => {
    const navigate = useNavigate();
    const logout = () => {
        navigate('/login');
        setCurrentData({
            id: null,
            roomID: null,
            rooms: null,
            loggedIn: false,
            userType: 'student'
        })
    }
    return (
        <button onClick={logout}>
            Log Out
        </button>
    )
}

export default Logout