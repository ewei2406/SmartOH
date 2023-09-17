export interface Student {
    id: string
    timestamp: Date
    question: string
    beginHelpedByID: string | null
}

export interface TA {
    id: string
    isBusy: boolean
}

export interface Room {
    isActive: boolean
    class: string
    avgStudentTime: number
    queue: Student[]
    description: string
    helpers: TA[]
}

/*

POST /api/student/join      Join the room queue, creates a new queue object
{
    studentID: string
    question: string
}

POST /api/student/leave     Leave the room
{
    studentID: string
}

SUBSCRIBE /api/queue        Subscribe to the queue

POST /api/ta/join           Join the room as TA
{
    taID: string
}

POST /api/ta/leave          Leave the room
{
    taID: string
}

POST /api/ta/move           Move a student
{
    studentID: string
    index: number
}

POST /api/ta/kick           Kick a student
{
    studentID: string
}

POST /api/ta/help           Set the status of a student to helped by you
{
    taID: string
    studentID: string
}

POST /api/ta/putback        Put a student back onto the queue
{
    studentID: string
    index: number
}

*/