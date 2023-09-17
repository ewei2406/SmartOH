const Popup = ({ showPopup, content }: any) => {
    return (
        <div style={{ 
            userSelect: "none", display: showPopup ? 'flex' : 'none', 
            position: "fixed", left: 0, right: 0, top: 0, bottom: 0, 
            backdropFilter: 'blur(5px)', zIndex: 99999,
            justifyContent: 'center', alignItems: 'center'
             }}>
            {content}
        </div>
    )
}

export default Popup