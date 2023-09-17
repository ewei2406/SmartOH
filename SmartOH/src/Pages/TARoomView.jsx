import React, { useRef, useState , useEffect} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OHService } from "../OHService";
import Logout from "../Components/Logout";
import Logo from "../Components/Logo";
import "./TARoomView.css";

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
    if(columnName == COLUMN_NAMES.CURRENTLY_HELPING) {
      OHService.helpAsTA(currentItem.taID, currentItem.roomID ,currentItem.id)
    }
    else if(columnName == COLUMN_NAMES.QUEUE) {
      OHService.putbackStudent(currentItem.id, currentItem.roomID , 0)
    }
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          beginHelpedByID: e.id == currentItem.id ? (e.beginHelpedByID === '' ?  taID : null) : e.beginHelpedByID
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
    item: { index, id, currentColumnName , taID, roomID},
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

  return (
    <div ref={ref} className="movable-item" style={{ opacity }}>
      {id}
    </div>
  );
};

const Column = ({ children, className, title}) => {
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
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <p>{title}</p>
      {children}
    </div>
  );
};

const TARoomView = ({ currentData, setCurrentData, rooms}) => { 
  
  var [roomID, setRoomID] = useState(currentData.roomID);
  var [taID, settaID] = useState(currentData.id);

  if(rooms && rooms[roomID]) {
    const [items, setItems] = useState(rooms[roomID].queue);
    const studentColumn = (student, taID) => {
      if(student.beginHelpedByID == taID) {
        return 'Currently Helping'
      }
      else {
        return 'Queue'
      }
    }

    useEffect(() => {
      if(rooms) {
        setRoomID(currentData.roomID)
        settaID(currentData.id)
        setItems(rooms[currentData.roomID].queue)
      }
    },[rooms])  

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
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Logo/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ color: '#085f05' }}>● Connected</div>
              <Logout currentData={currentData} setCurrentData={setCurrentData} />
          </div>
        </div>
        <div className='container1'>
          <DndProvider backend={HTML5Backend}>
            <Column title={CURRENTLY_HELPING} className="column currently-helping-column">
              {returnStudentsBeingHelped()}
            </Column>
            <Column title={QUEUE} className="column queue-column">
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