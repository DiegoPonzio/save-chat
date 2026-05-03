export const connectSocket = (username) => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onopen = () => {
        socket.send(JSON.stringify({ username }));
    };

    return socket;
};