import { useEffect, useState } from "react";
import { connectSocket } from "../socket.js";
import EmojiPicker from "emoji-picker-react";
import { Sidebar } from "./Sidebar.jsx";
import { Typing } from "./Typing.jsx";
import toast from "react-hot-toast";

export const Chat = ({ username }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typing, setTyping] = useState("");
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
        const ws = connectSocket(username);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // 💬 MENSAJES NORMALES
            if (data.type === "message") {
                setMessages((prev) => [...prev, data]);
                return;
            }

            // 👥 USUARIOS
            if (data.type === "users") {
                setUsers(data.data);
                return;
            }

            // ✍️ TYPING
            if (data.type === "typing") {
                setTyping(data.data);
                setTimeout(() => setTyping(""), 1500);
                return;
            }

            // ⚠️ WARNING
            if (data.type === "warning") {
                toast(data.data, { icon: "⚠️" });
                return;
            }

            // 🚨 STRIKE
            if (data.type === "strike") {
                toast.error(data.data);
                return;
            }

            // 🤖 SYSTEM (mute, ban, etc)
            if (data.type === "system") {
                toast(data.data, { icon: "🤖" });
                return;
            }
        };

        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (!text.trim()) return;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            toast.error("❌ No conectado al servidor");
            return;
        }

        socket.send(
            JSON.stringify({
                type: "message",
                data: text,
            }),
        );

        setText("");
        toast.success("Mensaje enviado");
    };

    const handleTyping = (e) => {
        setText(e.target.value);

        socket.send(
            JSON.stringify({
                type: "typing",
            }),
        );
    };

    return (
        <div className="container">
            <Sidebar users={users} />

            <div className="chat">
                <div className="messages">
                    {messages.map((m, i) => (
                        <div key={i} className="message">
                            {m.user && <b>{m.user}: </b>}
                            {m.data}
                        </div>
                    ))}
                </div>

                <Typing user={typing} />

                <div className="input">
                    <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

                    <input
                        value={text}
                        onChange={handleTyping}
                        placeholder="Escribe..."
                    />

                    <button onClick={sendMessage}>Enviar</button>
                </div>

                {showEmoji && (
                    <EmojiPicker
                        onEmojiClick={(e) => setText((prev) => prev + e.emoji)}
                    />
                )}
            </div>
        </div>
    );
};
