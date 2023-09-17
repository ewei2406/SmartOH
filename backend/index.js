const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
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

rooms = {
    'room A': {   
        class: "MATH 1",
        description: "Office hours in the engineering building basement",
        isActive: true,
        avgStudentTime: 324,
        'queue': [
            {
                id: "Carl",
                timestamp: new Date(),
                question: "I dont know 1+1",
                beginHelpedByID: null
            },
            {
                id: "Danny",
                timestamp: new Date(),
                question: "I dont know 2+2",
                beginHelpedByID: null
            },
            {
                id: "E",
                timestamp: new Date(),
                question: "I dont know 2+2",
                beginHelpedByID: null
            },
            {
                id: "F",
                timestamp: new Date(),
                question: "I dont know 2+2",
                beginHelpedByID: null
            },
            {
                id: "G",
                timestamp: new Date(),
                question: "I dont know 2+2",
                beginHelpedByID: null
            },
            {
                id: "H",
                timestamp: new Date(),
                question: "I dont know 2+2",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Alice', 'Bob']
    },
    'room B': {
        class: "MATH 2",
        description: "Office hours in the engineering building attic",
        isActive: true,
        avgStudentTime: 624,
        'queue': [
            {
                id: "Ginny",
                timestamp: new Date(),
                question: "I dont know 5+5",
                beginHelpedByID: null
            },
            {
                id: "Hank",
                timestamp: new Date(),
                question: "I dont know 6+6",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Eric', 'Frank']
    },
    'room C': {
        class: "MATH 3",
        description: "Office hours in the engineering building attic",
        isActive: true,
        avgStudentTime: 482,
        'queue': [
            {
                id: "Ginny",
                timestamp: new Date(),
                question: "I dont know 5+5",
                beginHelpedByID: null
            },
            {
                id: "Hank",
                timestamp: new Date(),
                question: "I dont know 6+6",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Eric', 'Frank']
    },
    'room D': {
        class: "MATH 4",
        description: "Office hours in the engineering building attic",
        isActive: true,
        avgStudentTime: 138,
        'queue': [
            {
                id: "Ginny",
                timestamp: new Date(),
                question: "I dont know 5+5",
                beginHelpedByID: null
            },
            {
                id: "Hank",
                timestamp: new Date(),
                question: "I dont know 6+6",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Eric', 'Frank']
    },
}

const sendUpdate = () => {
    io.emit("changed", rooms)
}

io.on('connection', (socket) => {
    console.log('a user connected');
    sendUpdate()

    socket.on('playerDataUp', (msg) => {
        console.log("HIII")
    })
});

app.use((req, res, next) => {
    // console.log("A request was sent!", req)
    next()
})

app.use(express.json())

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
    room.TAs.push(req.query.id)
    res.send('Joined the TAs')
    sendUpdate()
});

app.get('/api/ta/leave', (req, res) => {
    console.log(req.query.id)
    console.log(rooms)
    room = rooms[req.query.roomID]
    room.TAs = room.TAs.filter(ta => ta !== req.query.id)
    console.log(room.TAs)
    res.send('Left the TAs')
    console.log("LEFT SUCCESSFULLY")
    console.log(rooms)
    sendUpdate()
});

app.get('/api/ta/move', (req, res) => {
    room = rooms[req.query.roomID]

    

    student = room.queue.find(s => s.id === req.query.id)
    if (student) {
        room.queue = room.queue.filter(s => s.id !== student.id)
        room.queue.splice(req.query.index, 0, student)
        console.log('moving someone')
        res.send("Moved the student")
    } else {
        console.log('failed to move someone')
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