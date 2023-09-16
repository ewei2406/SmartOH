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
            <ul>
                <li>Student: {props.student.id}</li>
                <li>Question: {props.student.question}</li>
                <li>Similarity Score: {props.similarityScore}</li>
                <li>Queue Position: {props.queuePosition}</li>
            </ul>
        </Card>

    </>
}

export default QueueMember;
