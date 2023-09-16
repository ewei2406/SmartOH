import axios from 'axios'; // ES6 Modules
import { io, Socket } from "socket.io-client";

const subscribe = () => {
    const socket = io('ws://localhost:3000')
    socket.on('changed', m => console.log(m))
}

const joinAsStudent = (
    studentId: string, roomID: string, question: string) => {

    axios.get(
        `/api/student/join?id=${studentId} \
        &question=${question}&roomID=${roomID}`)
}

const OHService = { subscribe, joinAsStudent }

export {OHService}
