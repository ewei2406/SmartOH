const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const axios = require('axios')

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
        this.beginHelpedByID = null;
    }
}

class TA {
    constructor(id) {
        this.id = id
    }
}

rooms = {
    'OH in room A123': {
        class: "CS 1000",
        description: "Office hours in the engineering building basement",
        isActive: true,
        avgStudentTime: 324,
        'queue': [
            {
                id: "Carl Y",
                timestamp: new Date(),
                question: "How to print in python?",
                beginHelpedByID: null
            },
            {
                id: "Danny X",
                timestamp: new Date(),
                question: "How to get input in python",
                beginHelpedByID: null
            },
            {
                id: "Edgar P",
                timestamp: new Date(),
                question: "Get user input",
                beginHelpedByID: null
            },
            {
                id: "Frank S",
                timestamp: new Date(),
                question: "How to install python",
                beginHelpedByID: null
            },
            {
                id: "Garry G",
                timestamp: new Date(),
                question: "Install python on windows",
                beginHelpedByID: null
            },
            {
                id: "Harry L",
                timestamp: new Date(),
                question: "How to run python program",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Alice C', 'Bob P']
    },
    'HW Checkoff OH': {
        class: "CS 2000",
        description: "Office hours in the engineering building attic",
        isActive: true,
        avgStudentTime: 624,
        'queue': [
            {
                id: "Ginny G",
                timestamp: new Date(),
                question: "Memorization help for drainage homework",
                beginHelpedByID: null
            },
            {
                id: "Hank L",
                timestamp: new Date(),
                question: "What is Djikstras and how to implement",
                beginHelpedByID: null
            },
            {
                id: "Ian I",
                timestamp: new Date(),
                question: "How do you find the shortest path in a weighted graph?",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Janice P', 'Kim P']
    },
    'Confusing OH': {
        class: "CS 9999",
        description: "Office hours in the engineering building hidden room",
        isActive: true,
        avgStudentTime: 482,
        'queue': [
            {
                id: "Ginny Z",
                timestamp: new Date(),
                question: "I solved P=NP help me verify my answer",
                beginHelpedByID: null
            },
            {
                id: "Hank X",
                timestamp: new Date(),
                question: "Last step for turing-complete plants",
                beginHelpedByID: null
            }
        ],
        'TAs': ['Petra K', 'Frank Q']
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

const postData = {
    questions: [
        "How does bubble sort work?",
        "What is dynamic programming?",
        "How do you find the shortest path in a weighted graph?"
    ]
}

app.post('/api/ml/summarize', async (req, res) => {
    console.log("123")
    axios.post('http://localhost:8000/current-topic', postData).then(result => {
        res.json(result.data.current_topic)
    })
})

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
    console.log("SOMEONE JOINED THE QUEUE")
    sendUpdate()
});

app.get('/api/student/edit', (req, res) => {
    room = rooms[req.query.roomID]
    student = room.queue.find(s => s.id === req.query.id)
    student.question = req.query.question
    res.send('Updated the question')
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
        res.send("Moved the student")
    } else {
        res.send("Failed to move the student")
    }
    sendUpdate()
})

app.get('/api/ta/kick', (req, res) => {
    room = rooms[req.query.roomID]
    room.queue = room.queue.filter(s => s.id !== req.query.id)
    res.send("Kicked student " + req.params.id)
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