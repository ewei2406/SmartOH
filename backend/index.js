const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('playerDataUp', (msg) => {
        console.log("HIII")
    })
});

class Student {
    constructor(id, question) {
        this.id = id;
        this.timestamp = new Date();
        this.question = question;
        this.helpedBy = null;
    }
}

class TA {
    constructor(id) {
        this.id = id
    }
}

queue = []
TAs = []

rooms = {
    default: {   
        queue: [],
        TAs: []
    }
}

const sendUpdate = () => {
    io.emit("changed", rooms)
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/rooms/create', (req, res) => {
    if (req.query.roomID in rooms) {
        return res.send("failed to create the room")
    }

    rooms[req.query.roomID] = {
        id: req.query.roomID,
        queue: [],
        TAs: []
    }
    
    res.send("created the room")
})

app.get('/api/student/join', (req, res) => {
    room = rooms[req.query.roomID]
    room.queue.push(new Student(req.query.id, req.query.question))
    res.send('Joined the queue')
    sendUpdate()
});

app.get('/api/student/leave', (req, res) => {
    room = rooms[req.query.roomID]
    room.queue = room.queue.filter(s => s.id !== req.query.id)
    res.send('Left the queue')
    sendUpdate()
});

app.get('/api/ta/join', (req, res) => {
    room = rooms[req.query.roomID]
    room.TAs.push(new TA(req.query.id))
    res.send('Joined the TAs')
    sendUpdate()
});

app.get('/api/ta/leave', (req, res) => {
    room = rooms[req.query.roomID]
    room.TAs = room.TAs.filter(ta => ta.id !== req.query.id)
    res.send('Left the TAs')
    sendUpdate()
});

app.get('/api/ta/move', (req, res) => {
    room = rooms[req.query.roomID]

    student = room.queue.find(s => s.id === req.query.id)
    if (student) {
        room.queue = room.queue.filter(s => s.id !== student.id)
        room.queue.splice(req.query.index, 0, student)
        res.send("Moved the student")
    } else {
        res.send("Failed to move the student")
    }
    sendUpdate()
})

app.get('/api/ta/kick', (req, res) => {
    room = rooms[req.query.roomID]
    room.queue = room.queue.filter(s => s.id !== req.query.id)
    res.send("Kicked student "+ req.params.id)
    sendUpdate()
})

app.get('/api/ta/help', (req, res) => {
    room = rooms[req.query.roomID]
    s = room.queue.find(s => s.id === req.query.id)
    s.helpedBy = req.query.taID
    res.send(`Ta ${req.query.taID} is now helping ${req.query.id}`)
    sendUpdate()
})

app.get('/api/ta/putback', (req, res) => {
    room = rooms[req.query.roomID]
    student = room.queue.find(s => s.id === req.query.id)
    student.helpedBy = null
    if (student) {
        room.queue = room.queue.filter(s => s.id !== student.id)
        room.queue.splice(req.query.index, 0, student)
    }
    res.send(`${req.query.id} is no longer being helped and is now moved to ${req.query.index}`)
    sendUpdate()
})

server.listen(3000, () => {
    console.log(`App running on port ${3000}`)
})