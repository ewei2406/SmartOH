const UserIcon = ({ name, size, highlight }: any) => <div style={{
    borderRadius: size, border: `2px solid ` + (highlight ? 'var(--accent)' : 'var(--dark)'), flexShrink: 0,
    color: highlight ? 'var(--accent)' : 'var(--lightest)',
    width: size, height: size, fontWeight: 800, backgroundColor: highlight ? 'var(--medium)' : 'var(--accent)', filter: highlight ? 'none' : `hue-rotate(${(name.charCodeAt(0) * 1230) % 360}deg)`,
    display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: -10
}}>
    {name.slice(0,1)}
</div>

export default UserIcon