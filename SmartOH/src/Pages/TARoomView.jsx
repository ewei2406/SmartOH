import React, { useRef, useState , useEffect} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OHService } from "../OHService";
import "./TARoomView.css";

const COLUMN_NAMES = {
  CURRENTLY_HELPING: 'Currently Helping',
  QUEUE: 'Queue'
}

const MovableItem = ({
  id,
  timestamp,
  beingHelpedByID,
  question,
  index,
  currentColumnName,
  moveCardHandler,
  setItems,
  taID
}) => {
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          beginHelpedByID: e.id == currentItem.id ? (e.beginHelpedByID == null ?  taID : null) : e.beginHelpedByID
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
    item: { index, id, currentColumnName },
    type: "student",
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      console.log('dropResult', dropResult)

      if (dropResult) {
        const { name } = dropResult;
        const { CURRENTLY_HELPING, QUEUE} = COLUMN_NAMES;
        switch (name) {
          case CURRENTLY_HELPING:
            changeItemColumn(item, CURRENTLY_HELPING);
            break;
          case QUEUE:
            changeItemColumn(item, QUEUE);
            break;
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

const TARoomView = (props) => {   

  var [taID, settaID] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(
      [
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
          beginHelpedByID: 'Alice'
        }
      ],)
    settaID('Alice')
  }, [])

  const studentColumn = (student, taID) => {
    if(student.beginHelpedByID == taID) {
      return 'Currently Helping'
    }
    else {
      return 'Queue'
    }
  }

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragStudent = items[dragIndex];

    if (dragStudent) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragStudent);

        // remove item by "dragIndex" and put "prevItem" instead
        console.log('hello')
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);
        OHService.moveStudentAsTA(dragIndex, taID, dragStudent.id)
        
        return coppiedStateArray;
      });
    }
  };

  const returnStudentsInQueue = () => {
    return items
      .filter((student) => student.beginHelpedByID == null)
      .map((student, index) => (
        <MovableItem
          key={index}
          id={student.id}
          taID={taID}
          beingHelpedByID={student.beginHelpedByID}
          currentColumnName={studentColumn(student, taID)}
          timestamp={new Date()}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
  }
  const returnStudentsBeingHelped = () => {
    return items
      .filter((student) => student.beginHelpedByID == taID)
      .map((student, index) => (
        <MovableItem
          key={index}
          id={student.id}
          taID={taID}
          beingHelpedByID={student.beginHelpedByID}
          currentColumnName={studentColumn(student, taID)}
          timestamp={new Date()}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
  }

  const { CURRENTLY_HELPING, QUEUE } = COLUMN_NAMES;

  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
        <Column title={CURRENTLY_HELPING} className="column currently-helping-column">
          {returnStudentsBeingHelped()}
        </Column>
        <Column title={QUEUE} className="column queue-column">
          {returnStudentsInQueue()}
        </Column>
      </DndProvider>
    </div>
  );
};

export default TARoomView