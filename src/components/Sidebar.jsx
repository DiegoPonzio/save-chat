export const Sidebar = ({ users }) => {
    return (
        <div className="sidebar">
            <h3>🟢 Online</h3>
            {users.map((u, i) => (
                <div key={i}>{u}</div>
            ))}
        </div>
    );
}