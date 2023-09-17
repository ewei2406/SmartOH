import React, { useRef, useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OHService } from "../OHService";
import Logout from "../Components/Logout";
import Logo from "../Components/Logo";
import "./TARoomView.css";
import UserIcon from "../Components/UserIcon";
import { FaXmark, FaCircleCheck, FaCircleXmark, FaUserGroup, FaClock, FaBolt, FaCircleArrowLeft, FaCircleArrowDown } from 'react-icons/fa6'
import { PiDotsThreeVerticalBold } from 'react-icons/pi'
import Popup from "../Components/Popup";
<<<<<<< HEAD
import { GridLoader } from "react-spinners"
import { useNavigate } from "react-router-dom";
=======
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
>>>>>>> 4fef374cdeddcbac6b7caf1311907f031d24bb0b

const COLUMN_NAMES = {
    CURRENTLY_HELPING: 'Currently Helping',
    QUEUE: 'Queue'
}

function interpolateColor(x) {
    // Ensure that x is within the valid range
    x = Math.max(0, Math.min(100, x));
  
    // Define the RGB values for red and green
    const red = [255, 0, 0];
    const green = [0, 255, 0];
  
    // Calculate the interpolation factor
    // This factor will be 0 for x=0 (red), 1 for x=100 (green), and linear in between
    const interpolationFactor = x / 100;
  
    // Interpolate between red and green
    const interpolatedColor = [
      Math.round((1 - interpolationFactor) * red[0] + interpolationFactor * green[0]),
      Math.round((1 - interpolationFactor) * red[1] + interpolationFactor * green[1]),
      Math.round((1 - interpolationFactor) * red[2] + interpolationFactor * green[2])
    ];
  
    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
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
    roomID,
    matchPercentage,
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
                display: 'flex', alignItems: 'center', cursor: 'grab',
                gap: 10, borderRadius: 10, padding: 15, paddingLeft: 0, boxSizing: 'border-box'
            }}>
                <span style={{ margin: '0px -5px', fontSize: '2em', color: 'var(--medium)', display: 'flex', alignItems: 'center' }}><PiDotsThreeVerticalBold/></span>
                <UserIcon name={id} size={40} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: 3 }}>
                    <div style={{ fontWeight: 800, flexShrink: 0 }}>{id}</div>
                    <i style={{ color: 'var(--light)', fontSize: '0.8em', wordBreak: 'break-all' }}>{question}</i>
                </div>

                <div onClick={() => askDelete(id, roomID)} className="delete" style={{ color: 'var(--light)', position: 'absolute', top: 10, right: 10, fontSize: '0.8em' }}>
                    <FaXmark />
                </div>
                {matchPercentage && 
                <div style={{ width: 40, height: 40 , marginLeft: 'auto', flexShrink: '0', flexGrow: '0', paddingRight: '7px'}}>
                    <CircularProgressbar strokeWidth='6' text={matchPercentage} value={matchPercentage} styles={{
                        path: {
                            // Path color
                            stroke: interpolateColor(matchPercentage),
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                        },
                            // Customize the circle behind the path, i.e. the "total progress"
                            trail: {
                            // Trail color
                            stroke: '#2A2A2A',
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                        },
                        text: {
                            // Text color
                            fill: interpolateColor(matchPercentage),
                            // Text size
                            fontSize: '42px',
                            fontWeight: 'bold'
                        },
                    }}/>
                </div>}
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

    const show = isOver && canDrop

    return (
        <div
            ref={drop}
            className={className}
            style={{ color: getBackgroundColor(), display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
            <div style={{ alignItems: 'center', gap: 7, pointerEvents: 'none',
                position: 'absolute', top: 60, bottom: -10, left: -10, right: -10, 
                display: show ? 'flex' : 'none', justifyContent: 'center', paddingTop: 150, zIndex: 99990,
                backdropFilter: 'blur(5px)', color: 'var(--accent)', fontWeight: 800, fontSize: '2em', textShadow: '0 0 10px black'
            }}><FaCircleArrowDown/> Drop Here!</div>
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
                        matchPercentage={student.percentage}
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

        const calculatePercentages = () => {
            let target = items.filter((student) => student.beginHelpedByID === taID).map((student) => student.question);
            console.log('hello')
            if(target.length < 1) {
                return;
            }
            else {
                target = target[0];
            }
            let stringlist = items.filter((student) => student.beginHelpedByID === '').map((student) => student.question);
            OHService.getSimilarities({target_string: target, string_list: stringlist}).then((res) => {
                console.log(res.data);
                let percentages = res.data
                let index = 0;
                let newItems = items.map((student) => {
                    if(student.beginHelpedByID === '') {
                        let newStudent = student;
                        let percent = Math.round(percentages[index] * 100) < 10 ? 1 : Math.round(percentages[index] * 100);
                        if(percent > 100) { percent = 100;}
                        newStudent.percentage = percent;
                        index++;
                        return newStudent;
                    }
                    return student;
                });
                setItems(newItems);
            })
        }

        const { CURRENTLY_HELPING, QUEUE } = COLUMN_NAMES;

        const [summaryText, setSummaryText] = useState("No Summary generated yet!")
        const [loading, setLoading] = useState(false);

        const generate = () => {
            setLoading(true)
            OHService.getSummary(currentData.roomID, data => {
                setSummaryText(data.current_topic)
                setLoading(false);
            })
        }

        summaryText.charAt(0).toUpperCase()

        const navigate = useNavigate()
        const leaveRoom = () => {
            OHService.leaveAsTA(taID, roomID)
            navigate('/ta/rooms')
        }
        const percentage = 65;
        const minValue = 0;
        const maxValue = 65;


        return (
            <div className="container" style={{ width: 800 }}>
              <button onClick={calculatePercentages}>
              </button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Logo />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ color: '#085f05' }}>● Connected</div>
                        <button onClick={() => leaveRoom()} className="withIcon" style={{ filter: 'hue-rotate(135deg)'}}><FaCircleArrowLeft/> Leave Room</button>
                        <Logout currentData={currentData} setCurrentData={setCurrentData} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
                    <div style={{ width: '50%' }}>
                        <h2 >
                            {currentData.roomID}
                            <br />
                            <i style={{ color: 'var(--medium)', fontSize: '0.8em' }}>{rooms && rooms[currentData.roomID] && rooms[currentData.roomID].class}</i>
                        </h2>
                        <h3 style={{ color: 'var(--lighter)', display: 'flex', alignItems: 'center', gap: 7 }}> <FaClock />
                            Average Wait Time 
                            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 800, color: 'var(--accent)' }}> <FaBolt style={{ display: 'block' }} /> {Math.round(rooms && rooms[currentData.roomID] && (rooms[currentData.roomID].avgStudentTime / 6) / 10)} min</span>
                        </h3>
                    </div>

                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <h2>
                            <div className="withIcon"> <FaUserGroup /> TAs</div>
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
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className="withIcon"><FaBolt/> Room Topic Summary</h2>
                                <button style={{ display: 'flex' }} onClick={() => generate()} >{loading ? <GridLoader color="var(--accent)" size={4} margin={0} speedMultiplier={2}/> : <FaBolt />}</button>
                            </div>
                            <div style={{ width: '100%', position: 'relative', color: loading ? 'var(--light)' : 'var(--light)' }}>
                                <div style={{ filter: loading ? 'blur(5px)' : 'none', fontSize: '1em' }}>{summaryText.split("\n").map(c => <div>{c}</div>)}</div>
                                <div className="withIcon" style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', position: 'absolute', color: 'var(--accent)', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto'}}>
                                    <GridLoader color="var(--accent)" size={7} margin={0} speedMultiplier={2} /> Generating AI Summary...
                                </div>
                            </div>
                        </div>
                    </div>
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
        return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ color: '#085f05' }}>● Connected</div>
                <button onClick={() => leaveRoom()} className="withIcon" style={{ filter: 'hue-rotate(135deg)' }}><FaCircleArrowLeft /> Leave Room</button>
                <Logout currentData={currentData} setCurrentData={setCurrentData} />
            </div>
        </div>
    }
};

export default TARoomView;