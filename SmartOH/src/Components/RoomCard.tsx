import UserIcon from "./UserIcon"

export const RoomCard = ({ disable, joinRoom, name, room, message, subtitle }: any) => {

    const getIcon = (letter: string) => <div style={{ borderRadius: 20, border: '5px solid var(--medium)' }}>
        {letter}
    </div>

    return (<div style={{
        boxSizing: 'border-box',
        border: '1px solid var(--medium)',
        backgroundColor: 'var(--dark)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        gap: 10,
        width: '390px',
        userSelect: 'none'
    }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
                <div style={{ fontSize: '1.2em', fontWeight: 800 }}>
                    {name}
                </div>
                <span style={{ color: 'var(--light)' }}>{room.class}</span>
            </div>
            {subtitle && <span style={{ color: 'var(--light)', textAlign: 'right' }}><i>{subtitle}</i></span>}
        </div>


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: 'var(--light)', width: '50px' }}>TAs</span>
            <div style={{ display: 'flex', gap: -50 }}>
                {room.TAs.slice(0, 5).map((t: any) => <UserIcon key={t} name={t} size={30}/>)}
                {room.TAs.length > 5 && <div style={{
                    borderRadius: 30, border: '2px solid var(--dark)', padding: '0 10px',
                    height: 30, fontWeight: 800, backgroundColor: 'var(--medium)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                }}
                >{room.TAs.length - 5}+</div>}
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: 'var(--light)', width: '50px' }}>Queue</span>
            <div style={{ display: 'flex', gap: -50 }}>
                {room.queue.slice(0, 5).map((t: any) => <UserIcon key={t.id} name={t.id} size={30} />)}
                {room.queue.length > 5 && <div style={{
                    borderRadius: 30, border: '2px solid var(--dark)', padding: '0 10px',
                    height: 30, fontWeight: 800, backgroundColor: 'var(--medium)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10, zIndex: 999
                }}
                >{room.queue.length - 5}+</div>}
            </div>
        </div>

        <button style={{ marginTop: 15 }} disabled={disable} onClick={() => joinRoom(name)}>{message || "Join Room"}</button>
    </div>)
}

export default RoomCard