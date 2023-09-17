import React, { useRef, useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OHService } from "../OHService";
import Logout from "../Components/Logout";
import Logo from "../Components/Logo";
import "./TARoomView.css";
import UserIcon from "../Components/UserIcon";
import { FaXmark, FaCircleCheck, FaCircleXmark, FaUserGroup, FaClock } from 'react-icons/fa6'
import Popup from "../Components/Popup";

const COLUMN_NAMES = {
    CURRENTLY_HELPING: 'Currently Helping',
    QUEUE: 'Queue'
}

const MovableItem = ({
    id,
    timestamp,
    beginHelpedByID,
    question,
    index,
    currentColumnName,
    moveCardHandler,
    setItems,
    taID,
    roomID
}) => {
    const changeItemColumn = (currentItem, columnName) => {
        if (columnName == COLUMN_NAMES.CURRENTLY_HELPING) {
            OHService.helpAsTA(currentItem.taID, currentItem.roomID, currentItem.id)
        }
        else if (columnName == COLUMN_NAMES.QUEUE) {
            OHService.putbackStudent(currentItem.id, currentItem.roomID, 0)
        }
        setItems((prevState) => {
            return prevState.map((e) => {
                return {
                    ...e,
                    beginHelpedByID: e.id == currentItem.id ? (e.beginHelpedByID === '' ? taID : null) : e.beginHelpedByID
                };
            });
        });
    };

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: "student",
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCardHandler(dragIndex, hoverIndex);

            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        item: { index, id, currentColumnName, taID, roomID },
        type: "student",
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            if (dropResult) {
                if (dropResult.name != currentColumnName) {
                    // Only change the column if the item was dropped in a different column
                    changeItemColumn(item, dropResult.name);

                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));

    const [showpopup, setShowpopup] = useState(false);

    const askDelete = () => {
        setShowpopup(true)
        console.log('123')
    }

    const remove = () => {
        OHService.leaveAsStudent(id, roomID)
        setShowpopup(false)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
            <span style={{ color: 'var(--light)', fontWeight: 800, width: 30, textAlign: 'right' }}>{index + 1}.</span>
            <div ref={ref} className="card" style={{
                opacity, padding: 10, width: '100%',
                display: 'flex', alignItems: 'center',
                gap: 10, borderRadius: 10, padding: 15, paddingLeft: 25, boxSizing: 'border-box'
            }}>
                <UserIcon name={id} size={40} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: 3 }}>
                    <div style={{ fontWeight: 800, flexShrink: 0 }}>{id}</div>
                    <i style={{ color: 'var(--light)', fontSize: '0.8em', wordBreak: 'break-all' }}>{question}</i>
                </div>

                <div onClick={() => askDelete(id, roomID)} className="delete" style={{ color: 'var(--light)', position: 'absolute', top: 10, right: 10, fontSize: '0.8em' }}>
                    <FaXmark />
                </div>
            </div>
            <Popup showPopup={showpopup} content={
                <div className="card" style = {{ padding: 30, boxShadow: '0 0 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.5em' }}>Remove "{id}"?</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
                        <button style={{ filter: 'hue-rotate(90deg)', width: '50%' }} onClick={() => { setShowpopup(false) }}><div className="withIcon center"><FaCircleXmark /> Cancel</div></button>
                        <button style={{ width: '50%' }} disabled={!question || question === ""} onClick={() => { remove() }}><div className="withIcon center"><FaCircleCheck /> Remove</div></button>
                    </div>
                </div>
            }/>
        </div>
    );
};

const Column = ({ children, className, title, content }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "student",
        drop: () => ({ name: title }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
    });

    const getBackgroundColor = () => {
        if (isOver) {
            if (canDrop) {
                return "rgb(188,251,255)";
            } else if (!canDrop) {
                return "rgb(255,188,188)";
            }
        } else {
            return "";
        }
    };

    return (
        <div
            ref={drop}
            className={className}
            style={{ color: getBackgroundColor(), display: 'flex', flexDirection: 'column' }}
        >
            {content}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >{children}</div>
        </div>
    );
};



const TARoomView = ({ currentData, setCurrentData, rooms }) => {

    var [roomID, setRoomID] = useState(currentData.roomID);
    var [taID, settaID] = useState(currentData.id);

    if (rooms && rooms[roomID]) {
        const [items, setItems] = useState(rooms[roomID].queue);
        const studentColumn = (student, taID) => {
            if (student.beginHelpedByID == taID) {
                return 'Currently Helping'
            }
            else {
                return 'Queue'
            }
        }

        useEffect(() => {
            if (rooms) {
                setRoomID(currentData.roomID)
                settaID(currentData.id)
                setItems(rooms[currentData.roomID].queue)
            }
        }, [rooms])



        let TAs = []

        if (rooms && rooms[currentData.roomID]) {
            TAs = rooms[currentData.roomID].TAs
        }

    
        const moveCardHandler = (dragIndex, hoverIndex) => {
            const dragStudent = items[dragIndex];

            if (dragStudent) {

                OHService.moveStudentAsTA(taID, roomID, dragStudent.id, hoverIndex)

                setItems((prevState) => {
                    const coppiedStateArray = [...prevState];

                    // remove item by "hoverIndex" and put "dragItem" instead
                    const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragStudent);

                    // remove item by "dragIndex" and put "prevItem" instead
                    coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

                    return coppiedStateArray;
                });
            }
        };

        const returnStudentsInQueue = () => {
            return items
                .filter((student) => student.beginHelpedByID === '')
                .map((student, index) => (
                    <MovableItem
                        key={student.id}
                        id={student.id}
                        question={student.question}
                        taID={taID}
                        beginHelpedByID={student.beginHelpedByID}
                        currentColumnName={studentColumn(student, taID)}
                        timestamp={new Date()}
                        setItems={setItems}
                        index={index}
                        moveCardHandler={moveCardHandler}
                        roomID={roomID}
                    />
                ));
        }
        const returnStudentsBeingHelped = () => {
            return items
                .filter((student) => student.beginHelpedByID === taID)
                .map((student, index) => (
                    <MovableItem
                        key={student.id + '0' + index}
                        id={student.id}
                        taID={taID}
                        question={student.question}
                        beginHelpedByID={student.beginHelpedByID}
                        currentColumnName={studentColumn(student, taID)}
                        timestamp={new Date()}
                        setItems={setItems}
                        index={index}
                        moveCardHandler={moveCardHandler}
                        roomID={roomID}
                    />
                ));
        }


        const { CURRENTLY_HELPING, QUEUE } = COLUMN_NAMES;

        return (
            <div className="container" style={{ width: 800 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Logo />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ color: '#085f05' }}>● Connected</div>
                        <Logout currentData={currentData} setCurrentData={setCurrentData} />
                    </div>
                </div>

                <h2><FaClock />
                        Average Wait Time
                        <span style={{ fontWeight: 800, color: 'var(--accent)' }}> {Math.round(rooms && rooms[currentData.roomID] && (rooms[currentData.roomID].avgStudentTime / 6) / 10)} min</span>
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 style={{ width: '50%' }}>
                        {currentData.roomID}
                        <br />
                        <i style={{ color: 'var(--medium)', fontSize: '0.8em' }}>{rooms && rooms[currentData.roomID] && rooms[currentData.roomID].class}</i>
                    </h2>
                    <h2 style={{ width: '50%' }}>
                        <div className="withIcon"> <FaUserGroup /> TAs</div>
                        <br />
                        <div style={{ display: 'flex', gap: -50, marginTop: '15px', marginLeft: '15px' }}>
                            {TAs.slice(0, 5).map((t) => <UserIcon key={t} name={t} size={50} />)}
                            {TAs.length > 5 && <div style={{
                                borderRadius: 50, border: '2px solid var(--dark)', padding: '0 10px',
                                height: 50, fontWeight: 800, backgroundColor: 'var(--medium)', minWidth: 30,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                            }}
                            >{TAs.length - 5}+</div>}
                        </div>
                    </h2>
                </div>

                <div className='container1' style={{ width: 800, display: 'flex' }}>
                    <DndProvider backend={HTML5Backend}>
                        <Column title={CURRENTLY_HELPING} className="column currently-helping-column" content={
                            <h2>
                                Currently Helping
                            </h2>
                        }>
                            {returnStudentsBeingHelped()}
                        </Column>
                        <Column title={QUEUE} className="column queue-column" content={
                            <h2>
                                Queue
                            </h2>
                        }>
                            {returnStudentsInQueue()}
                        </Column>
                    </DndProvider>
                </div>
            </div>
        );
    }
    else {
        return <></>
    }
};

export default TARoomView;