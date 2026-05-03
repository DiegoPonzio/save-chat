export const Typing = ({ user }) => {
    if (!user) return null;

    return <div className="typing">{user} está escribiendo...</div>;
}