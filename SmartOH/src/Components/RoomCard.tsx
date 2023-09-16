export const RoomCard = ({ disable, joinRoom, name, room }: any) => {

    return(<div style={{ display: 'block', border: '1px solid black'}}>
        {name}
        <br />
        Class: {room.class}
        <br />
        TAs: {room.TAs.join(", ")}
        <br />
        Students: {room.queue.map((s: any) => s.id).join(", ")}
        <br />
        <button disabled={disable} onClick={() => joinRoom(name)}>Join room</button>
    </div>)
}

export default RoomCard