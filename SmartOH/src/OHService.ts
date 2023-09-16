import axios from 'axios'; // ES6 Modules
import { io, Socket } from "socket.io-client";

const subscribe = () => {
    const socket = io('ws://localhost:3000')
    socket.on('changed', m => console.log(m))
}

const joinAsStudent = (
    studentID: string, roomID: string, question: string) => {

    axios.get(
        `/api/student/join?id=${studentID}&question=${question}&roomID=${roomID}`)
}

const leaveAsStudent = (studentID: string, roomID: string) => {
    axios.get(`/api/student/leave?id=${studentID}&roomID=${roomID}`)
}

const joinAsTA = (
    taID: string, roomID: string) => {

    axios.get(
        `/api/ta/join?id=${taID}&roomID=${roomID}`)
}

const leaveAsTA = (taID: string, roomID: string) => {
    console.log("LEAVING")
    axios.get(`/api/ta/leave?id=${taID}&roomID=${roomID}`)
}

const OHService = { subscribe, joinAsStudent, joinAsTA, leaveAsTA, leaveAsStudent }

export {OHService}
