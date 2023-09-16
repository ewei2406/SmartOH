import QueueMember from '../QueueMember';

const TARoomView = (props: any) => {
    
    let TAid = props.currentData.id;
    let roomInfo = props.currentData.rooms[props.currentData.roomID];
    let studentsInRoom = roomInfo.queue.filter((student: any) => student.beginHelpedByID === TAid);
    let studentsInQueue = roomInfo.queue.filter((student: any) => student.beginHelpedByID === TAid);

    return (
        <div style={{
            display: 'flex',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{font: 'bold'}}>In Room</div>
                    {(studentsInRoom).map((student: any, i: number) => {
                        return <QueueMember student={student} similarityScore="100%" queuePosition={1} key={i}/>
                    })}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{font: 'bold'}}>Queue</div>
                    {(studentsInQueue).map((student: any, i: number) => {
                        return <QueueMember student={student} similarityScore="100%" queuePosition={1} key={i}/>
                    })}
            </div>
        </div>)
}

export default TARoomView;