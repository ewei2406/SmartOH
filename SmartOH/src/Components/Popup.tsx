const Popup = ({ showPopup, content }: any) => {
    return (
        <div style={{ display: showPopup ? 'block' : 'none' }}>
            {content}
        </div>
    )
}

export default Popup