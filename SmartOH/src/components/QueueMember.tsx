import { Student } from '../../../Student';
import { Card } from '@mui/material';

interface Props {
    student: Student;
    similarityScore: string;
    queuePosition: number;
}
const QueueMember = (props: Props) => {
    return <>
        <Card>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                Student: {props.student.id}
                Question: {props.student.question}
                Current Match: {props.similarityScore}
                Queue Position: {props.queuePosition}
            </div>
        </Card>

    </>
}

export default QueueMember;
